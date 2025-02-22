import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import "./MyPageViewConsulting.scss";

import MyPageViewConsultingProfessional from "./MyPageViewConsultingProfessional/MyPageViewConsultingProfessional";
import MyPageViewConsultingRecipient from "./MyPageViewConsultingRecipient/MyPageViewConsultingRecipient";
import MyPageViewConsultingStatus from "./MyPageViewConsultingStatus/MyPageViewConsultingStatus";
import MyPageViewConsultingContext from "./MyPageViewConsultingContext/MyPageViewConsultingContext";
import MyPageViewConsultingComment from "./MyPageViewConsultingComment/MyPageViewConsultingComment";

const MyPageViewConsulting = (props) => {
  let CONSULTING_QUERY;

  if (props.ver === "professional") {
    CONSULTING_QUERY = gql`
      query($id: ID!) {
        me {
          user {
            consultings_pro(where: { id: $id }) {
              title
              type
              createdAt
              status
              description
              recipient {
                username
                thumbnail {
                  url
                }
                avatar
              }
              consulting_comments {
                description
                createdAt
                user {
                  username
                  thumbnail {
                    url
                  }
                  avatar
                }
              }
            }
          }
        }
      }
    `;
  } else {
    CONSULTING_QUERY = gql`
      query($id: ID!) {
        me {
          user {
            consultings_rec(where: { id: $id }) {
              title
              type
              createdAt
              status
              description
              professional {
                username
                thumbnail {
                  url
                }
                avatar
              }
              consulting_comments {
                description
                createdAt
                user {
                  username
                  thumbnail {
                    url
                  }
                  avatar
                }
              }
            }
          }
        }
      }
    `;
  }

  let consulting;

  const { data, loading, error } = useQuery(CONSULTING_QUERY, {
    ssr: false,
    variables: {
      id: props.id,
    },
  });

  if (loading) {
    return null;
  }

  if (error) {
    if (JSON.stringify(error.graphQLErrors[0].message) === '"Forbidden"') {
      return <p>권한이 없습니다.</p>;
    } else {
      return <p>Error: {JSON.stringify(error)}</p>;
    }
  }

  if (data) {
    if (props.ver === "professional") {
      consulting = data.me.user.consultings_pro[0];
    } else {
      consulting = data.me.user.consultings_rec[0];
    }
  }

  return (
    <div id="MyPageViewConsulting">
      <div className="my-page-view-consulting__area parents">
        <div className="my-page-view-consulting__area__contents parents">
          {props.ver === "professional" ? (
            <MyPageViewConsultingRecipient
              recipient={consulting.recipient}
              id={props.id}
              status={consulting.status}
            />
          ) : (
            <MyPageViewConsultingProfessional
              professional={consulting.professional}
            />
          )}
          <MyPageViewConsultingStatus status={consulting.status} />
          <MyPageViewConsultingContext
            title={consulting.title}
            description={consulting.description}
            date={consulting.createdAt}
            type={consulting.type}
          />
          <MyPageViewConsultingComment
            comments={consulting.consulting_comments}
            id={props.id}
          />
        </div>
      </div>
    </div>
  );
};

export default MyPageViewConsulting;
