
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
    imageUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQGJv3A3CiijhQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1659711667949?e=1762992000&v=beta&t=UuEsknmuGFIzsAPS59tRxz-iUyK_xSbQJ9ha_H-Krt8',
  },
  {
    name: 'Aniket Kumar',
    rollNumber: '22053293',
    linkedin: 'https://www.linkedin.com/in/aniket-kumar-85a539229/',
    imageUrl: 'https://picsum.photos/seed/dev2/200/200',
  },
  {
    name: 'Anshu Kumar',
    rollNumber: '22053284',
    linkedin: 'https://www.linkedin.com/in/anshu-kumar-108b35248/',
    imageUrl: 'https://picsum.photos/seed/dev3/200/200',
  },
   {
    name: 'Ayush Kumar',
    rollNumber: '22053613',
    linkedin: 'https://www.linkedin.com/',
    imageUrl: 'https://picsum.photos/seed/dev4/200/200',
  },
   {
    name: 'Yash Vardhan',
    rollNumber: '22052323',
    linkedin: 'https://www.linkedin.com/',
    imageUrl: 'https://picsum.photos/seed/dev5/200/200',
  },
];

export const projectGuide: ProjectGuide = {
  name: 'Dr. Ranjita Kumari Dash',
  designation: 'Professor, Dept. of Computer Science',
  website: 'https://cse.kiit.ac.in/profiles/ranjita-kumari-dash/',
  linkedin: 'https://in.linkedin.com/in/dr-ranjita-kumari-dash-27b41117',
  imageUrl: 'https://media.licdn.com/dms/image/v2/C5103AQGyZUjlEkY86w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1542281173297?e=2147483647&v=beta&t=cHPtAX1oYAG3ojs1tBjY-4_NfcxLiU3e5ML0YzLgmqE',
};
