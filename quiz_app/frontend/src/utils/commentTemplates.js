// Predefined comment templates for common study notes
export const commentTemplates = [
  {
    id: 'important',
    label: '⭐ Important',
    text: 'Important concept to remember: '
  },
  {
    id: 'review',
    label: '📝 Review Later',
    text: 'Need to review this topic again - '
  },
  {
    id: 'confused',
    label: '❓ Confused',
    text: 'Still unclear about: '
  },
  {
    id: 'gotit',
    label: '✅ Got It',
    text: 'Understood! Key point: '
  },
  {
    id: 'memorize',
    label: '🧠 Memorize',
    text: 'Must memorize: '
  },
  {
    id: 'example',
    label: '💡 Example',
    text: 'Real-world example: '
  },
  {
    id: 'related',
    label: '🔗 Related',
    text: 'This relates to: '
  },
  {
    id: 'tip',
    label: '💭 Tip',
    text: 'Study tip: '
  }
];

export const getTemplateById = (id) => {
  return commentTemplates.find(template => template.id === id);
};