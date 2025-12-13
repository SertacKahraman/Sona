export const RELATIONSHIP_TYPES = {
    romantic: {
        id: 'romantic',
        label: 'Eş/Partner',
        emoji: '💕',
        gradient: ['#FF6B9D', '#C06C84'],
        description: 'Romantik ilişki'
    },
    family: {
        id: 'family',
        label: 'Aile/Akraba',
        emoji: '👨‍👩‍👧‍👦',
        gradient: ['#A8E6CF', '#56AB91'],
        description: 'Aile bireyi'
    },
    parent_child: {
        id: 'parent_child',
        label: 'Ebeveyn/Çocuk',
        emoji: '👶',
        gradient: ['#FFD93D', '#FFA500'],
        description: 'Ebeveyn veya çocuk'
    },
    friend: {
        id: 'friend',
        label: 'Arkadaş',
        emoji: '🤝',
        gradient: ['#6BCF7F', '#4CAF50'],
        description: 'Arkadaşlık'
    },
    professional: {
        id: 'professional',
        label: 'İş Arkadaşı/Patron',
        emoji: '💼',
        gradient: ['#4FC3F7', '#2196F3'],
        description: 'İş ilişkisi'
    },
    diger: {
        id: 'diger',
        label: 'Diğer',
        emoji: '✨',
        gradient: ['#E0C3FC', '#8EC5FC'],
        description: 'Diğer yakınlıklar'
    }
};

export const getRelationshipInfo = (type) => {
    return RELATIONSHIP_TYPES[type] || RELATIONSHIP_TYPES.diger;
};
