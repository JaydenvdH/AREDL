import { store } from "../main.js";
import { embed, getFontColour } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
    patreon: "patreon",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">

            <!-- Province Tabs !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
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

            <div class="list-container">
                <table class="list" v-if="filteredList">
                    <tr v-for="([level, err], i) in filteredList">
                        <td class="rank">
                            <p v-if="i + 1 <= 999" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>

                    <div class="packs" v-if="level.packs.length > 0">
                        <div v-for="pack in level.packs" class="tag" :style="{background:pack.colour}">
                            <p>{{pack.name}}</p>
                        </div>
                    </div>

                    <iframe class="video" :src="embed(level.verification)" frameborder="0"></iframe>

                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(getGlobalRank(), 100, level.percentToQualify, list.length) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>

                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 150"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else>100% or better to qualify</p>

                    <table class="records">
                        <tr v-for="record in filteredRecords" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>

            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>

                    <div class="og">
                        <p class="type-label-md">Original List by <a href="https://tsl.pages.dev/#/" target="_blank">TheShittyList</a></p>
                    </div>

                    <template v-if="editors">
                        <h3 align="center">List Editors</h3>
                        <ol class="editors">
                            <ol class="rank" v-for="rank in editors">
                                <li v-for="member in rank.members">
                                    <img :src="\`/assets/\${roleIconMap[rank.role]}\${store.dark ? '-dark' : ''}.svg\`">
                                    <a v-if="member.link" class="type-label-lg link" target="_blank" :href="member.link">{{ member.name }}</a>
                                    <p v-else>{{ member.name }}</p>
                                </li>
                            </ol>
                        </ol>
                    </template>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        selectedProvince: "All",
        provinces: [],
        userMap: {},
        errors: [],
        roleIconMap,
        store,
    }),
    computed: {
    filteredList() {
        if (this.selectedProvince === "All") return this.list;

        return this.list.filter(([level]) => {
            if (!level) return false;

        // Check verifier
        const verifierProvince =
            this.userMap[
                Object.keys(this.userMap).find(
                    (u) => u.toLowerCase() === level.verifier.toLowerCase()
                )
            ] || "Unknown";

        if (verifierProvince === this.selectedProvince) return true;

        // Check records
        return level.records.some((r) => {
            const province =
                this.userMap[
                    Object.keys(this.userMap).find(
                        (u) => u.toLowerCase() === r.user.toLowerCase()
                    )
                ] || "Unknown";

            return province === this.selectedProvince;
        });
    });
},
        level() {
            return this.filteredList[this.selected]?.[0];
        },
        filteredRecords() {
    if (!this.level) return [];

    const records = [];

    // Include verifier
    const verifierProvince =
        this.userMap[
            Object.keys(this.userMap).find(
                (u) => u.toLowerCase() === this.level.verifier.toLowerCase()
            )
        ] || "Unknown";

    if (
        this.selectedProvince === "All" ||
        verifierProvince === this.selectedProvince
    ) {
        records.push({
            user: this.level.verifier,
            percent: 100,
            link: this.level.verification,
            mobile: false,
            hz: "?",
        });
    }

    // Other
    this.level.records.forEach((r) => {
        const province =
            this.userMap[
                Object.keys(this.userMap).find(
                    (u) => u.toLowerCase() === r.user.toLowerCase()
                )
            ] || "Unknown";

        if (
            this.selectedProvince === "All" ||
            province === this.selectedProvince
        ) {
            records.push(r);
        }
    });

    return records;
},
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Load userMap
        try {
            const res = await fetch("/data/_users.json");
            this.userMap = await res.json();
        } catch {
            this.userMap = {};
        }

        // Build Provinces - "Unknown"
        const provinces = new Set();

        this.list.forEach(([level]) => {
            if (!level) return;

            level.records.forEach((r) => {
                const province =
                    this.userMap[
                        Object.keys(this.userMap).find(
                            (u) => u.toLowerCase() === r.user.toLowerCase()
                        )
                    ] || "Unknown";

                if (province !== "Unknown") {
                    provinces.add(province);
                }
            });
        });

        this.provinces = ["All", ...Array.from(provinces)];

        // Error Handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        getFontColour,

        // Helper function to grab the global rank, no matter the province selected
        getGlobalRank() {
            if (!this.level) return 0;

            const index = this.list.findIndex(
                ([lvl]) => lvl && lvl.name === this.level.name
            );

            return index + 1;
        }
    },
};