import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('/post/fetchPosts', async () => {
	const { data } = await axios.get('/post');
	return data
});

export const fetchUserPosts = createAsyncThunk('/post/fetchUserPosts', async (token) => {
	const { data } = await axios.get(`/post?userPost=true&userId=${token}`);
	return data	
});

export const fetchTags = createAsyncThunk('/post/fetchTags', async () => {
	const { data } = await axios.get('/post/tags');
	return data
});

export const fetchRemovePost = createAsyncThunk('/post/fetchRemovePost', async (id) => axios.delete('/post/' + id));

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	}
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {

		[fetchUserPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading'
		},
		[fetchUserPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded'
		},
		[fetchUserPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error'
		},

		[fetchPosts.pending]: (state) => {
			state.posts.items = [];
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded'
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error'
		},

		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = 'loaded'
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error'
		},

		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
			state.tags.status = 'loading';
		},
	}
});

export const postsReducer = postsSlice.reducer;