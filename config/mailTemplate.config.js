import mailGen from 'mailgen'

export const mailGenerator = new mailGen({
  theme: 'default',
  product: {
    name: 'Team Caliban Lunch',
    link: 'https://krispam.vercel.app/',
  },
});
