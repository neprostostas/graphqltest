import { gql } from '@apollo/client'

export const SEARCH_ALL_REQUEST = gql`
  query searchRequests($searchValue: String, $skip: Float, $first: Float) {
    searchRequests(first: $first, skip: $skip, searchValue: $searchValue) {
      id
      business_name
      business_phone
      business_mail

      description
      link_to_map
      link_to_site

      owners_phone
      owners_name
      photo
  }
}
`;

export const LOGIN_USER = gql`
  mutation ($login: String!, $password: String!) {
    loginWidthLoginPass(login: $login, password: $password)
  }
`;
