# Token Rate Limiting Implementation Plan

## Objective
Implement a rate-limiting mechanism to control API token usage in the **Sona** application. This will prevent excessive usage of the Gemini API and allow better cost/quota management.

## Current State
- `ChatService.js` handles API calls to Gemini.
- `AppContext.js` manages global state but is not currently tracking daily token usage or limits.
- `ChatService.js` was recently updated to log token usage to the console.

## Proposed Strategy
We will implement a **daily token limit** mechanism.

1.  **Define Limits**:
    - MAX_DAILY_TOKENS: 50,000 (Example limit, adjustable)
    - MAX_REQUESTS_PER_MINUTE: 10 (Optional throttle)
    
2.  **State Management (`AppContext.js`)**:
    - Add state to track `dailyTokenUsage`.
    - Add timestamp for `lastTokenUsageReset`.
    - Function `consumeTokens(count)` to update usage and check limits.
    - Persist these values to `AsyncStorage`.

3.  **Service Integration (`ChatService.js`)**:
    - Modify `ChatService` to accept a `checkLimit` callback or access context (though pure functions are cleaner, we might need to pass an updater).
    - Alternatively, handle the logic in `ChatScreen.js` which has access to `useApp`.
    - **Better Approach**: Since `ChatService` is a stateless helper file, we should manage the *check* and *update* in `ChatScreen.js` around the API call, OR invoke context methods passed into `generateChatResponse`.
    
    Given `generateChatResponse` is just a function, we will pass a `tokenUsageCallback` to it, or handle it in the calling component (`ChatScreen`).
    
    **Decision**: We will handle the limit check in `ChatScreen.js` BEFORE calling `generateChatResponse`, and update the usage AFTER getting the response (using the usage metadata).

## Implementation Steps

### Step 1: Update `AppContext.js`
- Initialize `dailyTokenUsage` state.
- Create `checkTokenLimit()` function: returns `true` if limit is not exceeded, `false` otherwise.
- Create `updateTokenUsage(promptTokens, responseTokens)` function:
    - Adds to `dailyTokenUsage`.
    - Checks if the day has changed since `lastUsageDate`, if so, resets counter first.
    - Persists to `AsyncStorage`.

### Step 2: Update `ChatScreen.js`
- Import `checkTokenLimit` and `updateTokenUsage` from context.
- In `handleSend`:
    1. Call `checkTokenLimit()`. If false, show an alert/toast to the user and return early.
    2. Call `generateChatResponse`.
    3. Extract usage metadata from the response (we need to modify `ChatService` to return the full object or metadata, currently returns string text).
    4. Call `updateTokenUsage` with the new values.

### Step 3: Modify `ChatService.js` Return Value
- Currently `generateChatResponse` returns just `text`.
- We need it to return an object: `{ text, usageMetadata }`.
- Update error handling to return safe defaults.

### Step 4: UI Feedback
- Display a "Daily limit reached" message when applicable.
- (Optional) Show a simple indicator in the UI of usage (e.g., in Profile or Debug menu).

## Detailed Code Changes

### `src/context/AppContext.js`

```javascript
// Add CONSTANTS
const MAX_DAILY_TOKENS = 100000; // Example

// In AppProvider
const [dailyTokenUsage, setDailyTokenUsage] = useState(0);
const [lastUsageDate, setLastUsageDate] = useState(new Date().toDateString());

// Load usage data on mount
useEffect(() => {
  const loadUsageData = async () => {
    try {
      const storedDate = await AsyncStorage.getItem('lastUsageDate');
      const storedUsage = await AsyncStorage.getItem('dailyTokenUsage');
      const today = new Date().toDateString();

      if (storedDate === today) {
        setDailyTokenUsage(parseInt(storedUsage) || 0);
        setLastUsageDate(storedDate);
      } else {
        setDailyTokenUsage(0);
        setLastUsageDate(today);
      }
    } catch (e) {
      console.error("Token verisi yüklenemedi", e);
    }
  };

  loadUsageData();
}, []);

// Methods
const checkTokenLimit = () => {
  const today = new Date().toDateString();
  if (today !== lastUsageDate) {
    // New day, reset implicitly (actual reset happens in update, 
    // but for check we can assume 0 if dates differ)
    return true; 
  }
  return dailyTokenUsage < MAX_DAILY_TOKENS;
};

const updateTokenUsage = async (tokens) => {
  const today = new Date().toDateString();
  let currentUsage = dailyTokenUsage;
  
  if (today !== lastUsageDate) {
    currentUsage = 0;
    setLastUsageDate(today);
    await AsyncStorage.setItem('lastUsageDate', today);
  }
  
  const newUsage = currentUsage + tokens;
  setDailyTokenUsage(newUsage);
  await AsyncStorage.setItem('dailyTokenUsage', newUsage.toString());
};
```

### `src/services/ChatService.js`
Return object instead of string:

```javascript
return {
  text: response.text(),
  usageMetadata: response.usageMetadata
};
```
*(Refactor `ChatScreen` to handle this object structure)*

## Verification
- Run the app.
- Send messages.
- Verify console logs and internal state updates.
- Manually set a low limit to test the blocking mechanism.
