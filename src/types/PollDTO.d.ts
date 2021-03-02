interface PollChoicesDTO {
  name: string;
  option: number;
  order: number;
  value: number;
}

interface PollDTO {
  added: string;
  answered: YesNo;
  choices: Array<PollChoicesDTO>;
  id: number;
  question: string;
  staff: number;
  userAnswer: number;
}