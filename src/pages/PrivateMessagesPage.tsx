import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import moment from "moment";

import { styled } from "baseui";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Block } from "baseui/block";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { toaster } from "baseui/toast";
import { Pagination } from "baseui/pagination";
import { StatefulTooltip } from "baseui/tooltip";
import { StyledSpinnerNext } from "baseui/spinner";
import { ListItem, ListItemLabel } from "baseui/list";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";
import { Select, Value, OnChangeParams } from "baseui/select";
import { LabelLarge, ParagraphXSmall } from "baseui/typography";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";
import { Search, Show, Hide, DeleteAlt, ChevronLeft } from "baseui/icon";

import {
  Comment,
  CommentAction,
  CommentAvatar,
  CommentAvatarWrapper,
  CommentBody,
  CommentHeader,
  CommentTextWrapper,
  CommentInputComponent
} from "../components/comment";
import { UserTag } from "../components/UserTag";
import { PencilIcon } from "../components/icons";
import { PageTitle } from "../components/PageTitle";
import { ForumList } from "../pages/forums/ForumList";
import { ElevatedPanel } from "../components/ElevatedPanel";
import { PaginationWrapper } from "../components/PaginationWrapper";
import { ConfirmActionModal } from "../components/ConfirmActionModal";
import { ContentWrapper, CenteredLayout } from "../components/ContentWrapper";

import { RootStateType } from "../reducers";

import * as Api from "../api";
import * as Actions from "../actions";
import * as Helpers from "../helpers";

enum PageSection {
  INBOX,
  OUTBOX,
  SEARCH
}

const Bold = styled("span", {
  fontWeight: "bold"
});

interface MessageModalProps {
  compose?: string;
  messageId: number;
  pageSection: PageSection;
  onClose: () => void;
}

const MessageContent = ({ message }: { message: MessageDTO }) => (
  <Comment>
    <CommentAvatarWrapper>
      <Link to={`/profile/id/${message.sender.id}`}>
        <CommentAvatar
          src={Helpers.GetUserAvatarURL(message.sender)}
          loading="lazy"
        />
      </Link>
    </CommentAvatarWrapper>
    <CommentBody>
      <CommentHeader>
        <Block display="inline-block">
          <UserTag user={message.sender} />
          <StatefulTooltip
            content={moment(message.added).format("LLLL")}
          >
            <ParagraphXSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "inline-block",
                    marginTop: 0,
                    marginBottom: $theme.sizing.scale200,
                    marginLeft: $theme.sizing.scale200
                  })
                }
              }}
            >
              {moment(message.added).fromNow()}
            </ParagraphXSmall>
          </StatefulTooltip>
        </Block>
        <ParagraphXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "inline",
                marginTop: $theme.sizing.scale200,
                marginBottom: $theme.sizing.scale200
              })
            }
          }}
        >
          <CommentAction
            onClick={() => {
              Actions.QuoteForumPost(
                `[quote="${message.sender.username}"]${message.msg}[/quote]`
              );
            }}
          >
            Citiraj
          </CommentAction>
        </ParagraphXSmall>
      </CommentHeader>
      <CommentTextWrapper>
        {Helpers.FormatBBcode(message.msg)}
      </CommentTextWrapper>
    </CommentBody>
  </Comment>
);

interface SearchResultsType {
  username: string;
}

const MessageModal = (
  { compose, messageId, pageSection, onClose }: MessageModalProps
) => {
  const [selected_username, setSelectedUsername] = useState<Value>([]);
  const [search_term, setSearchTerm] = useState<string>("");
  const [search_results, setSearchResults] = useState<Array<SearchResultsType>>([]);
  const [is_searching, setIsSearching] = useState(false);

  const debounced_search_term = Helpers.useDebounce(search_term, 250);

  useEffect(() => {
    if (debounced_search_term.length > 2) {
      setIsSearching(true);

      Api.SearchUser(debounced_search_term)
        .then((response) => {
          setIsSearching(false);

          if (!response)
            return setSearchResults([]);

          const usernames: Array<SearchResultsType> = [];
          response.forEach((username) => {
            usernames.push({ username: username });
          });

          setSearchResults(usernames);
        })
        .catch(() => {
          setIsSearching(false);
          toaster.warning("Greška se dogodila prilikom pretrage", {});
        });
    }
  }, [debounced_search_term]);

  useEffect(() => {
    if (compose !== undefined) {
      setSearchTerm(compose);
      setSelectedUsername([{ username: compose }]);
    }
  }, [compose]);

  const { data: message, isError } = useQuery(
    ["pm", messageId],
    () => (
      Api.GetPrivateMessage(messageId)
        .then((response) => {
          Helpers.FillFakeUser(response, "receiver");
          Helpers.FillFakeUser(response, "sender");

          return response;
        })
    ),
    { enabled: (messageId !== 0) }
  );

  const OnSelectChange = (params: OnChangeParams) => {
    setSelectedUsername(params.value);
    if (params.value.length === 0)
      return setSearchTerm("");

    setSearchTerm((params.value[0] as any).username)
  }

  if (messageId === 0 && compose === undefined)
    return null;

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      size="full"
      role="dialog"
      isOpen={messageId !== 0 || compose !== undefined}
      onClose={onClose}
    >
      {(compose === undefined && message === undefined) ? (
        <CenteredLayout $style={{ marginTop: "15%" }}>
          <StyledSpinnerNext />
        </CenteredLayout>
      ) : (
        <>
          <ModalHeader>
          {(compose !== undefined) ? (
            <Select
              type="search"
              labelKey="username"
              maxDropdownHeight="55vh"
              placeholder="Unesite korisničko ime primaoca..."
              noResultsMsg="Molimo unesite 3 karaktera ili više da biste započeli pretragu"
              isLoading={is_searching}
              value={selected_username}
              options={search_results}
              onChange={OnSelectChange}
              onInputChange={(event) => setSearchTerm(event.currentTarget.value)}
            />
          ) : null}
          </ModalHeader>
          <ModalBody $style={{ marginBottom: 0 }}>
            {isError ? (
              <CenteredLayout>
                <LabelLarge>Greška se dogodila prilikom učitavanja ove poruke.</LabelLarge>
              </CenteredLayout>
            ) : (
              <>
                {(compose === undefined && message !== undefined) ? (
                  <MessageContent message={message} />
                ) : null}
                <Block marginTop="scale100">
                  <CommentInputComponent
                    type="pm"
                    id={
                      (message !== undefined) ? (
                        pageSection === PageSection.OUTBOX ?
                        message.receiver.id :
                        message.sender.id
                      ) : 0
                    }
                    additionalField={(search_term === "") ? undefined : search_term}
                    onSubmit={() => {
                      toaster.positive("Vaša poruka je poslata uspešno!", {});
                      onClose();
                    }}
                  />
                </Block>
              </>
            )}
          </ModalBody>
          <ModalFooter $style={{ marginTop: 0 }}>
            <ModalButton
              kind="tertiary"
              onClick={onClose}
            >
              Nazad
            </ModalButton>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
};

interface ParamsType {
  section: string;
  page?: string;
  search?: string;
}

const GetPageSection = (section: string) => {
  switch (section) {
    case "in": return PageSection.INBOX;
    case "out": return PageSection.OUTBOX;
    case "search": return PageSection.SEARCH;
    default: return PageSection.INBOX;
  }
}

const GetPageSectionAsString = (section: PageSection) => {
  switch (section) {
    case PageSection.INBOX: return "in";
    case PageSection.OUTBOX: return "out";
    case PageSection.SEARCH: return "search";
    default: return "in";
  }
}

interface ListButtonProps {
  title: string;
  section: PageSection;
  currentSection: PageSection;
  onSwitch: (section: PageSection) => void;
}

const ListButton = ({
  title,
  section,
  currentSection,
  onSwitch
}: ListButtonProps) => (
  <span onClick={() => onSwitch(section)}>
    <ListItem
      endEnhancer={() => (
        <>
          {(currentSection === section) ? (
            <ChevronLeft />
          ) : null}
        </>
      )}
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            cursor: "pointer",
            ":hover": { backgroundColor: $theme.colors.backgroundSecondary }
          })
        }
      }}
    >
      <ListItemLabel>{title}</ListItemLabel>
    </ListItem>
  </span>
);

const PrivateMessagesPage = () => {
  const history = useHistory();
  const params = useParams<ParamsType>();
  const auth = useSelector((state: RootStateType) => state.auth);

  const input_ref = useRef<HTMLInputElement | null>(null);
  const [compose, setCompose] = useState<string | undefined>(undefined);
  const [message_id, setMessageId] = useState(0);
  const [remove_message_id, setRemoveMessageId] = useState(-1);

  const current_page = +(params.page || 1);
  const current_section = GetPageSection(params.section);
  const current_search_query = params.search || "";

  const {
    data: content,
    isFetching
  } = useQuery(
    ["all_pms", current_page, current_section, current_search_query],
    () => {
      const compose_param = new URLSearchParams(location.search).get("compose");
      if (compose_param !== null)
        setCompose(compose_param);

      let endpoint = null;
      switch (current_section) {
        case PageSection.OUTBOX:
          endpoint = Api.GetOutbox(current_page - 1);
          break;
        case PageSection.INBOX:
          endpoint = Api.GetInbox(current_page - 1);
          break;
        case PageSection.SEARCH:
          if (current_search_query !== "")
            endpoint = Api.SearchPrivateMessages(current_page - 1, current_search_query);
          break;
      }

      if (!endpoint)
        return null;

      return endpoint
        .then((response) => {
          Helpers.FillFakeUser(response.content, "sender");
          Helpers.FillFakeUser(response.content, "receiver");

          return response;
        });
    }
  )

  const Switch = (value: PageSection) => {
    history.push(`/pm/${GetPageSectionAsString(value)}/1`);
  }

  const OnPageChange = (args: { nextPage: number }): void => {
    const additional = (current_search_query !== "" ? `/${current_search_query}` : "");
    history.push(`/pm/${params.section}/${args.nextPage}${additional}`);
  }

  const OnSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input_ref || !input_ref.current)
      return;

    const next_search_query = input_ref.current.value;
    if (next_search_query.length < 3)
      return;

    history.push(`/pm/search/1/${next_search_query}`);
  }

  const query_client = useQueryClient();

  const remove_mutation = useMutation(
    (id: number) => Api.DeletePrivateMessage(id),
    {
      onSuccess: () => {
        setRemoveMessageId(-1);

        query_client.invalidateQueries([
          "all_pms",
          current_page,
          current_section,
          current_search_query
        ]);
        toaster.positive("Poruka izbrisana uspešno!", {});
      },
      onError: () => {
        toaster.negative(`Greška se dogodila prilikom brisanja privatne poruke`, {});
      }
    }
  );

  if (auth.user === undefined)
    return null;

  return (
    <ContentWrapper>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <PageTitle>Privatne poruke</PageTitle>
        </Cell>
        <Cell span={[4, 8, 3]}>
          <Button
            onClick={() => setCompose("")}
            startEnhancer={() => <PencilIcon inverse />}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "100%",
                  marginBottom: $theme.sizing.scale300
                })
              }
            }}
          >
            Napišite poruku
          </Button>
          <ForumList>
            <ListButton
              title="Primljene poruke"
              section={PageSection.INBOX}
              currentSection={current_section}
              onSwitch={Switch}
            />
            <ListButton
              title="Poslate poruke"
              section={PageSection.OUTBOX}
              currentSection={current_section}
              onSwitch={Switch}
            />
            <ListButton
              title="Pretraga"
              section={PageSection.SEARCH}
              currentSection={current_section}
              onSwitch={Switch}
            />
          </ForumList>
        </Cell>
        <Cell span={[4, 8, 9]}>
          <ElevatedPanel>
            {(current_section === PageSection.SEARCH) ? (
              <form onSubmit={OnSearch}>
                <Block
                  display="flex"
                  marginBottom={current_search_query !== "" ? "scale600" : undefined}
                >
                  <Input
                    clearable
                    placeholder="Unesite pojam za pretragu..."
                    inputRef={input_ref}
                    startEnhancer={() => <Search size={20} />}
                  />
                  <Button
                    type="submit"
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({ marginLeft: $theme.sizing.scale200 })
                      }
                    }}
                  >
                    Pretraži
                  </Button>
                </Block>
              </form>
            ) : null}
            {(!content || isFetching) ? (
              <>
                {(
                  (current_section !== PageSection.SEARCH) ||
                  (current_section === PageSection.SEARCH && current_search_query !== "")
                ) ? (
                  <CenteredLayout>
                    <StyledSpinnerNext />
                  </CenteredLayout>
                ) : null}
              </>
            ) : (
              <>
                {content.content.length === 0 ? (
                  <CenteredLayout>
                    <LabelLarge>
                      Nije pronađena nijedna poruka sa zadatim terminom pretrage.
                    </LabelLarge>
                  </CenteredLayout>
                ) : (
                  <TableBuilder
                    data={content.content}
                    overrides={{
                      TableBodyRow: {
                        style: ({ $theme, $rowIndex }) => ({
                          backgroundColor: (
                            $rowIndex % 2 ?
                            $theme.colors.backgroundSecondary :
                            $theme.colors.tableBackground
                          ),
                          ":hover": {
                            backgroundColor: $theme.colors.backgroundTertiary
                          }
                        })
                      },
                      TableBodyCell: {
                        style: { verticalAlign: "middle", textAlign: "center" }
                      }
                    }}
                  >
                    <TableBuilderColumn>
                      {(message) => (
                        <>
                          {message.unread === "YES" ? (
                            <Hide title="Nepročitano" />
                          ) : (
                            <Show title="Pročitano" />
                          )}
                        </>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn
                      header="Vreme"
                      overrides={{
                        TableBodyCell: {
                          style: {
                            verticalAlign: "middle",
                            textAlign: "unset"
                          }
                        }
                      }}
                    >
                      {(message) => (
                        <StatefulTooltip
                          content={moment(message.added).format("LLLL")}
                        >
                          {message.unread === "YES" ? (
                            <Bold>{moment(message.added).fromNow()}</Bold>
                          ) : (
                            moment(message.added).fromNow()
                          )}
                        </StatefulTooltip>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn
                      header={
                        (current_section === PageSection.INBOX) ?
                        "Poslao" : (
                          (current_section === PageSection.OUTBOX) ?
                          "Primio" :
                          "Korisnik"
                        )
                      }
                    >
                      {(message) => (
                        <UserTag
                          user={
                            message.sender.id === auth.user?.id ?
                            message.receiver :
                            message.sender
                          }
                        />
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn
                      header="Poruka"
                      overrides={{
                        TableBodyCell: {
                          style: { verticalAlign: "middle", textAlign: "unset" }
                        }
                      }}
                    >
                      {(message) => (
                        <>
                          {message.unread === "YES" ? (
                            <Bold>{message.hint}</Bold>
                          ) : (
                            message.hint
                          )}
                        </>
                      )}
                    </TableBuilderColumn>
                    <TableBuilderColumn>
                      {(message) => (
                        <Block display="flex" flexDirection="column">
                          <Button
                            size="mini"
                            kind="primary"
                            startEnhancer={() => <Show />}
                            onClick={() => setMessageId(message.id)}
                          >
                            Prikaži
                          </Button>
                          {current_section !== PageSection.SEARCH ? (
                            <Button
                              size="mini"
                              kind="secondary"
                              startEnhancer={() => <DeleteAlt />}
                              onClick={() => setRemoveMessageId(message.id)}
                              overrides={{
                                Root: {
                                  style: ({ $theme }) => ({ marginTop: $theme.sizing.scale100 })
                                }
                              }}
                            >
                              Izbriši
                            </Button>
                          ) : null}
                        </Block>
                      )}
                    </TableBuilderColumn>
                  </TableBuilder>
                )}
                {content.totalPages > 0 ? (
                  <Cell span={12}>
                    <PaginationWrapper>
                      <Pagination
                        size="mini"
                        numPages={content.totalPages}
                        currentPage={current_page}
                        onPageChange={OnPageChange}
                      />
                    </PaginationWrapper>
                  </Cell>
                ) : null}
              </>
            )}
          </ElevatedPanel>
        </Cell>
        <ConfirmActionModal
          title="Obriši poruku"
          isOpen={remove_message_id !== -1}
          onConfirm={() => {
            remove_mutation.mutate(remove_message_id);
          }}
          onClose={() => setRemoveMessageId(-1)}
        />
        <MessageModal
          compose={compose}
          messageId={message_id}
          pageSection={current_section}
          onClose={() => {
            setMessageId(0);
            setCompose(undefined);
          }}
        />
      </Grid>
    </ContentWrapper>
  );
};

export default PrivateMessagesPage;
