export type TeamMember = {
  name: string;
  rollNumber: string;
  linkedin: string;
  imageUrl: string;
};

export type ProjectGuide = {
  name: string;
  designation: string;
  website: string;
  imageUrl: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: 'Developer One',
    rollNumber: '12345',
    linkedin: 'https://www.linkedin.com/',
    imageUrl: 'https://picsum.photos/seed/dev1/200/200',
  },
  {
    name: 'Developer Two',
    rollNumber: '67890',
    linkedin: 'https://www.linkedin.com/',
    imageUrl: 'https://picsum.photos/seed/dev2/200/200',
  },
  {
    name: 'Developer Three',
    rollNumber: '11223',
    linkedin: 'https://www.linkedin.com/',
    imageUrl: 'https://picsum.photos/seed/dev3/200/200',
  },
];

export const projectGuide: ProjectGuide = {
  name: 'Guide Name',
  designation: 'Professor, Dept. of Computer Science',
  website: 'https://example.com',
  imageUrl: 'https://picsum.photos/seed/guide/200/200',
};
