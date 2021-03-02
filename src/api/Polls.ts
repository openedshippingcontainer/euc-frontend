import { HttpClient } from "./HttpClient";

export const FetchLastUserPoll = () => HttpClient<PollDTO>("lastUserPoll");
export const FetchAllUserPolls = (page: number) => (
  HttpClient<PagedResult<PollDTO>>(`allUserPolls?page=${page}`)
);

export const FetchLastStaffPoll = () => HttpClient<PollDTO>("lastStaffPoll");
export const FetchAllStaffPolls = (page: number) => (
  HttpClient<PagedResult<PollDTO>>(`allStaffPolls?page=${page}`)
);

export const SendPollVote = (id: number, selection: number) => (
  HttpClient<PollDTO>(
    "pollVote",
    {
      body: {
        "pollId": id,
        "selection": selection
      }
    }
  )
);