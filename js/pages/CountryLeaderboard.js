import { fetchCountryLeaderboard } from '../content.js';
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
<main v-else class="page-leaderboard-container">
    <div class="page-leaderboard">
        <div class="error-container">
            <p class="error" v-if="err.length > 0">
                Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
            </p>
        </div>

        <!-- Province Tabs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
        <div class="province-tabs">
            <button
                v-for="province in provinces"
                :key="province"
                @click="selectedProvince = province; selected = 0"
                :class="{ active: selectedProvince === province }"
            >
                {{ province }}
            </button>
        </div>

        <div class="board-container">
            <table class="board">
                <tr v-for="(ientry, i) in entries">
                    <td class="rank">
                        <p class="type-label-lg">#{{ i + 1 }}</p>
                    </td>
                    <td class="total">
                        <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                    </td>
                    <td class="user" :class="{ 'active': selected == i }">
                        <button @click="selected = i">
                            <span class="type-label-lg">{{ ientry.user }}</span>
                        </button>
                    </td>
                </tr>
            </table>
        </div>

        <div class="player-container" v-if="entry">
            <div class="player">
                <h2>
                    #{{ selected + 1 }}
                    <span class="global-rank">(#{{ getGlobalRankByUser(entry) }})</span>
                    {{ entry.user }} - 
                    {{ entry.verified.length + entry.completed.length }} demons
                </h2>
                <h3>{{ entry.total }} points</h3>

                <div class="packs" v-if="entry.packs.length > 0">
                    <div
                        v-for="pack in entry.packs"
                        class="tag"
                        :style="{background:pack.colour, color:getFontColour(pack.colour)}"
                    >
                        {{ pack.name }}
                    </div>
                </div>

                <h2 v-if="entry.verified.length > 0">
                    First Victor ({{ entry.verified.length}})
                </h2>
                <table class="table">
                    <tr v-for="score in entry.verified">
                        <td class="rank">
                            <p>#{{ score.rank }}</p>
                        </td>
                        <td class="level">
                            <a class="type-label-lg" target="_blank" :href="score.link">
                                {{ score.level }}
                            </a>
                        </td>
                        <td class="score">
                            <p>+{{ localize(score.score) }}</p>
                        </td>
                    </tr>
                </table>

                <h2 v-if="entry.completed.length > 0">
                    Completed ({{ entry.completed.length }})
                </h2>
                <table class="table">
                    <tr v-for="score in entry.completed">
                        <td class="rank">
                            <p>#{{ score.rank }}</p>
                        </td>
                        <td class="level">
                            <a class="type-label-lg" target="_blank" :href="score.link">
                                {{ score.level }}
                            </a>
                        </td>
                        <td class="score">
                            <p>+{{ localize(score.score) }}</p>
                        </td>
                    </tr>
                </table>

                <h2 v-if="entry.progressed.length > 0">
                    Progressed ({{entry.progressed.length}})
                </h2>
                <table class="table">
                    <tr v-for="score in entry.progressed">
                        <td class="rank">
                            <p>#{{ score.rank }}</p>
                        </td>
                        <td class="level">
                            <a class="type-label-lg" target="_blank" :href="score.link">
                                {{ score.percent }}% {{ score.level }}
                            </a>
                        </td>
                        <td class="score">
                            <p>+{{ localize(score.score) }}</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</main>
    `,
    computed: {
        entries() {
            if (this.selectedProvince === "All") {
                return Object.values(this.leaderboard)
                    .flat()
                    .sort((a, b) => b.total - a.total);
            }
            return this.leaderboard[this.selectedProvince] || [];
        },
        entry() {
            return this.entries[this.selected];
        },
    },
    async mounted() {
    const [leaderboard, err] = await fetchCountryLeaderboard();

    this.leaderboard = leaderboard;

    // Filter out "Unknown" button
    const provinces = Object.keys(leaderboard).filter(
        (p) => p !== "Unknown"
    );

    // Add "All" at the start
    this.provinces = ["All", ...provinces];
    this.selectedProvince = "All";

    this.err = err;
    this.loading = false;
},
    methods: {
        localize,
        getFontColour,

        // Helper function to grab a specified user's global rank
        getGlobalRankByUser(user) {
            const flat = Object.values(this.leaderboard).flat();

            const index = flat.findIndex((u) => u.user === user.user);

            return index + 1;
        },
    },
};
