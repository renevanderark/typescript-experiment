import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    SolrFacetedSearch,
    SolrClient,
    SearchHandlers,
    SearchState,
    defaultComponentPack,
    QueryState
} from "solr-faceted-search-react";

// The search fields and filterable facets you want
const fields = [
    {label: "Name", field: "name_t", type: "text", value: "a*"},
    {label: "Person Type", field: "types_ss", type: "list-facet", value: ["AUTHOR", "ARCHETYPE"]},
    {label: "Gender", field: "gender_s", type: "list-facet"},
    {label: "Country", field: "relatedLocations_ss", type: "list-facet"},
    {label: "Language", field: "language_ss", type: "list-facet"},
    {label: "Year of birth", field: "birthDate_i", type: "range-facet", value: [0, 1999]},
    {label: "Year of death", field: "deathDate_i", type: "range-facet"},
    {label: "Place of birth", field: "birthPlace_ss", type: "list-facet"},
    {label: "Place of death", field: "deathPlace_ss", type: "list-facet"},
    {label: "Marital status", field: "maritalStatus_ss", type: "list-facet"},
    {label: "Children", field: "children_s", type: "list-facet"},
    {label: "Social class", field: "socialClass_ss", type: "list-facet"},
    {label: "Education", field: "education_ss", type: "list-facet"},
    {label: "Religion/ideology", field: "religion_ss", type: "list-facet"},
    {label: "Profession and other activities", field: "profession_ss", type: "list-facet"},
    {label: "Financial aspects", field: "financialSituation_ss", type: "list-facet"},
    {label: "Memberships", field: "memberships_ss", type: "list-facet"},
    {label: "Provisional notes", field: "notes_t", type: "text"}
];

// The sortable fields you want
const sortFields = [
    {label: "Name", field: "nameSort_s", value: "asc"},
    {label: "Date of birth", field: "birthDate_i"},
    {label: "Modified", field: "modified_l"},
    {label: "Date of death", field: "deathDate_i"}
];

const customComponents = defaultComponentPack;

customComponents.results.result = (props: {}) => <div>result</div>;

function typeSafeAssign<T extends U, U>(target: T, source: U) : T {
    return Object.assign(target, source);
}


document.addEventListener("DOMContentLoaded", () => {
    // The client class
    const solrClient = new SolrClient({
        // The solr index url to be queried by the client
        url: "http://localhost:8983/solr/wwpersons/select",
        searchFields: fields,
        sortFields: sortFields,
        idField: "id",

        // The change handler passes the current query- and result state for render
        // as well as the default handlers for interaction with the search component
        onChange: doRender});

    solrClient.initialize(); // this will send an initial search, fetching all results from solr

    function doRender (state: SearchState, handlers: SearchHandlers)  {
        // Render the faceted search component
        ReactDOM.render(
            <div>
                <button onClick={() => solrClient.setFilters([{field: "type_s", value: ["person"]}])}>setFilters</button>
                <button onClick={() => solrClient.setSortFieldValue("nameSort_s", "desc") }>setSortFieldValue</button>
                <button onClick={() => solrClient.setFacetSort("types_ss", "index") }>setSortFieldValue</button>
                <button onClick={() => solrClient.setSearchFieldValue("name_t", "b*") }>setSearchFieldValue1</button>
                <button onClick={() => solrClient.setSearchFieldValue("birthDate_i", [1800, 1900]) }>setSearchFieldValue1</button>
                <button onClick={() => solrClient.setSearchFieldValue("gender_s", ["MALE", "FEMALE"]) }>setSearchFieldValue2</button>
                <button onClick={() => solrClient.setCurrentPage(5) }>setCurrentPage</button>
                <button onClick={() => {
                    solrClient.sendQuery(typeSafeAssign<QueryState, {pageStrategy?: string}>(solrClient.state.query, {pageStrategy: "paginate"}));
                }
                }>sendQuery</button>
                <SolrFacetedSearch
                    {...state}
                    {...handlers}
                    bootstrapCss={true}
                    onSelectDoc={(doc) => console.log(doc)}

                    truncateFacetListsAt={20}
                    customComponents={customComponents}
                />
            </div>,
            document.getElementById("app"))
    }
});

