export default `
    union personSearch = Client | Vendor

    type personQuery {
        firstSearchResult: personSearch
    }
`;
