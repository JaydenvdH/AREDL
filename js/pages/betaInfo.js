import { localize, getFontColour } from '../util.js';

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
    <h1>Beta page</h2>
</main>
    `
}