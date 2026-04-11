import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
data: () => ({
    leaderboard: {},
    provinces: [],
    selectedProvince: null,
    loading: true,
    selected: 0,
    err: [],
}),
    template: `
        <main v-if="loading">
    <Spinner></Spinner>
</main>
    <h1>Beta Info</h1>

    <p>Hi, Mel here.</p> 
    <p>I'm working on DDL 2.0 right now, and I'd like you guys to be able to access those pages beforehand, for i.e. testing purposes.</p>

    <p>Here's the updated list page:</p>
    <router-link to="/countrylist">
        <button>CountryList</button>
    </router-link>

    <p>And here's the updated leaderboard page:</p>
    <router-link to="/countryleaderboard">
        <button>CountryLeaderboard</button>
    </router-link>
    <p>Happy browsing!</p>
    <p><small>Oh. Btw. DM me if u find a bug. @melted.nl ofc.</small><p>
</main>
    `
}