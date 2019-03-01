<template>
	<v-app style="background: #E3E3EE">
		<!-- Side Navbar -->
		<v-navigation-drawer app temporary fixed v-model="sideNav">
			<v-toolbar color="accent" dark flat>
				<v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
				<router-link to="/" tag="span" style="cursor: pointer">
					<h1 class="title pl-3">VueVue</h1>
				</router-link>
			</v-toolbar>
			<v-divider></v-divider>
			<!-- Side Navbar Links -->
			<v-list>
				<v-list-tile ripple v-for="item in horizontalNavItems" :key="item.title" :to="item.link" exact>
					<v-list-tile-action>
						<v-icon>{{item.icon}}</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>{{item.title}}</v-list-tile-content>
				</v-list-tile>
				<!-- Signout Button -->
				<v-list-tile v-if="user">
					<v-list-tile-action>
						<v-icon>account_box</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>Profile</v-list-tile-content>
				</v-list-tile>
				<v-list-tile v-if="user" @click="handleSignoutUser">
					<v-list-tile-action>
						<v-icon>exit_to_app</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>Signout</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar fixed color="primary" dark>
			<!-- App Title -->
			<v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
			<v-toolbar-title class="hidden-xs-only">
				<router-link to="/" tag="span" style="cursor: pointer">VueVue</router-link>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<!-- search input -->
			<v-text-field
				v-model="searchTerm" @input="handleSearchPosts"
				flex
				prepend-icon="search"
				placeholder="Search posts"
				color="accent"
				single-line
				hide-details
			></v-text-field>
			<!-- Search Results Card -->
			<v-card dark v-if="searchResults.length" id="search__card">
				<v-list>
					<v-list-tile @click="goToSearchResult(result._id)"
					v-for="result in searchResults" :key="result._id">
						<v-list-tile-title>
							{{result.title}} - 
							<span class="font-weight-thin">{{formatDescription(result.description)}}</span>
						</v-list-tile-title>
						<!-- Show Icon if Favortied by User -->
						<v-list-tile-action v-if="checkIfUserFavorite(result._id)">
							<v-icon>favorite</v-icon>
						</v-list-tile-action>
					</v-list-tile>
				</v-list>
			</v-card>
			<!-- Horizontal navbar -->
			<v-toolbar-items class="hidden-xs-only">
				<v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link" exact>
					<v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
					{{item.title}}
				</v-btn>
				<!-- Profile button} -->
				<v-btn flat to="/profile" v-if="user">
					<v-icon class="hidden-sm-only">account_box</v-icon>
					<v-badge right color="blue darken-2" :class="{'bounce': badgeAnimated}">
						<span slot="badge" v-if="userFavorites.length" >{{userFavorites.length}}</span>
						Profile
					</v-badge>
				</v-btn>
				<!-- Signout Button -->
				<v-btn flat v-if="user" @click="handleSignoutUser">
					<v-icon class="hidden-sm-only" left>exit_to_app</v-icon>Signout
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>
		<main>
			<v-container class="mt-4">
				<transition name="fade">
					<router-view/>
				</transition>
				<!-- Auth Snackbar -->
				<v-snackbar color="success" bottom left :timeout="4000" v-model="authSnackbar">
					<v-icon class="mr-3">check_circle</v-icon>
					<h3>You are now signed in!</h3>
					<v-btn dark flat @click="authSnackbar = false">Close</v-btn>
				</v-snackbar>
				<!-- Auth Error Snackbar -->
				<v-snackbar
					v-if="authError"
					v-model="authErrorSnackbar"
					color="info"
					:timeout="5000"
					bottom
					left
				>
					<v-icon class="mr-3">cancel</v-icon>
					<h3>{{authError.message}}</h3>
					<v-btn dark flat to="/signin">Sign in</v-btn>
				</v-snackbar>
			</v-container>
		</main>
	</v-app>
</template>

<script>
import { mapGetters } from "vuex";
import { setTimeout } from 'timers';
export default {
	name: "App",
	data() {
		return {
			searchTerm: '',
			sideNav: false,
			authSnackbar: false,
			authErrorSnackbar: false,
			badgeAnimated: false
		};
	},
	watch: {
		user(newValue, oldValue) {
			// if we had no value for user before, show snackbar
			if (oldValue === null) {
				this.authSnackbar = true;
			}
		},
		authError(value) {
			// if auth error is not null, show auth error snackbar
			if (value !== null) {
				this.authErrorSnackbar = true;
			}
		},
		userFavorites(value) {
			// if user favorites value changed
			if(value) {
				this.badgeAnimated = true
				setTimeout(() => (this.badgeAnimated = false), 1000)
			}
		}
	},
	computed: {
		...mapGetters(["searchResults","user", "authError", "userFavorites"]),
		horizontalNavItems() {
			let items = [
				{ icon: "chat", title: "Posts", link: "/posts" },
				{ icon: "lock_open", title: "Sigin In", link: "/signin" },
				{ icon: "create", title: "Sigin Up", link: "/signup" }
			];
			if (this.user) {
				items = [
					{ icon: "chat", title: "Posts", link: "/posts" },
					{ icon: "stars", title: "Create Post", link: "/post/add" }
					// {icon: 'account_box', title: 'Profile', link: '/profile'}
				];
			}
			return items;
		}
	},
	methods: {
		handleSearchPosts(){
			this.$store.dispatch('searchPosts', {
				searchTerm: this.searchTerm
			})
		},
		toggleSideNav() {
			this.sideNav = !this.sideNav;
		},
		goToSearchResult(resultId){
			//  Clear search term
			this.searchTerm = ''
			// Go to desired result
			this.$router.push(`/posts/${resultId}`)
			// Clear search results
			this.$store.commit('clearSearchResults')
		},
		formatDescription(desc){
			desc.length > 10 ? `${desc.slice(0, 20)}...`: desc
		},
		checkIfUserFavorite(resultId){
			return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId)
		},
		handleSignoutUser() {
			this.$store.dispatch("signoutUser");
		}
	}
};
// moment(new Date(date)).format("ll")
// moment(new Date(date)).fromNow()
</script>
<style>
.fade-enter-active,
.fade-leave-active {
	transition-property: all;
	transition-duration: 0.25s;
}
.fade-enter-active {
	transition-delay: 0.25s;
}
.fade-enter,
.fade-leave-active {
	opacity: 0;
	transform: translateX(-25px);
}
/* Search Results Card */
#search__card {
	position: absolute;
	width: 100vw;
	z-index: 8;
	top: 100%;
	left: 0%;
}
/* User Favorite Animation */
.bounce {
	animation: bounce 1s both;
}

@keyframes bounce {
	0%, 20%, 53%, 80%, 100% {
		transform: translate3d(0, 0, 0)
	}

	40%, 43% {
		transform: translate3d(0, -20px, 0)
	}

	70% {
		transform: translate3d(0, -10px, 0)
	}

	90% {
		transform: translate3d(0, -4px, 0)
	}
}

</style>