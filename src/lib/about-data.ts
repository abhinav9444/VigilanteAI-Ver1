
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
  linkedin: string;
  imageUrl: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: 'Abhinav Kumar Singh',
    rollNumber: '22051564',
    linkedin: 'https://www.linkedin.com/in/abhinavkrsingh03/',
    imageUrl: 'https://picsum.photos/seed/dev1/200/200',
  },
  {
    name: 'Aniket Kumar',
    rollNumber: '21053245',
    linkedin: 'https://www.linkedin.com/in/aniket-kumar-85a539229/',
    imageUrl: 'https://picsum.photos/seed/dev2/200/200',
  },
  {
    name: 'Anshu Kumar',
    rollNumber: '21051289',
    linkedin: 'https://www.linkedin.com/in/anshu-kumar-108b35248/',
    imageUrl: 'https://picsum.photos/seed/dev3/200/200',
  },
];

export const projectGuide: ProjectGuide = {
  name: 'Dr. Ranjita Kumari Dash',
  designation: 'Professor, Dept. of Computer Science',
  website: 'https://cse.kiit.ac.in/profiles/ranjita-kumari-dash/',
  linkedin: 'https://in.linkedin.com/in/dr-ranjita-kumari-dash-27b41117',
  imageUrl: 'https://picsum.photos/seed/guide/200/200',
};
