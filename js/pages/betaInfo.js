import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        err: [],
    }),
    template: `
    <main>
        <div class="beta-page">
            <h1>Beta Info</h1>

            <p>Hi, Mel here.</p>

            <p>
                I'm working on DDL 2.0 right now, and I'd like you guys to be able
                to access those pages beforehand for testing purposes.
            </p>

            <p>Here's the updated list page:</p>
            <router-link to="/countrylist">
                <button>CountryList</button>
            </router-link>

            <p>And here's the updated leaderboard page:</p>
            <router-link to="/countryleaderboard">
                <button>CountryLeaderboard</button>
            </router-link>

            <p>Happy browsing!</p>

            <p>
                <small>Oh, btw, DM me if u find a bug. @melted.nl ofc.</small>
            </p>
        </div>
    </main>
`
}