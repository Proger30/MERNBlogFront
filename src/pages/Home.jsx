import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, Tab, Tabs } from '@mui/material';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchUserPosts, fetchTags } from '../redux/slices/posts';

export const Home = ({isUserPosts}) => {
	const { name } = useParams();
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);

	const [sortedPosts, setSortedPosts] = useState(posts.items);
	const [tabs, setTabs] = useState("new");

	const isPostLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';


	
	//Можно было сортировку на бэке сделать, но хотел сделать на фронте (как испытание для себя) :)
	const onChangeTabs = (value) => {
		setTabs(value);
		let tempPosts = [...posts.items];
		setSortedPosts(tempPosts.filter((post) => name ? post.tags.includes(name) : post.tags).sort((a, b) => {
			if (value==="new") {
				const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
				if (dateA > dateB) {
					return -1;
					}
				if (dateA < dateB) {
					return 1;
				}
				return 0;
			} else if (value === "popular") {
				if (a.viewsCount > b.viewsCount) {
					return -1;
					}
				if (a.viewsCount < b.viewsCount) {
					return 1;
				}
				return 0;
			}
		}));

	};

	useEffect(() => {
		dispatch(isUserPosts ? fetchUserPosts(window.localStorage.getItem('token')) : fetchPosts());
		dispatch(fetchTags());
		let tempPosts = [...posts.items];
		setSortedPosts(tempPosts.filter((post) => name ? post.tags.includes(name) : post.tags).sort((a, b) => {
			const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
			if (dateA > dateB) {
				return -1;
			}
			if (dateA < dateB) {
				return 1;
			}
			return 0;
		})
		);
	}, [isUserPosts]);

	useEffect(() => {
		let tempPosts = [...posts.items];
		setSortedPosts(tempPosts.filter((post) => name ? post.tags.includes(name) : post.tags).sort((a, b) => {
				const dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
				if (dateA > dateB) {
					return -1;
				}
				if (dateA < dateB) {
					return 1;
				}
				return 0;
			})
		);
	}, [posts, name, userData]);

  return (
    <>
	  {name && <Typography variant="h3"># {name}</Typography> }
      <Tabs style={{ marginBottom: 15 }} value={tabs} onChange={(e, value) => onChangeTabs(value)} aria-label="basic tabs example">
        <Tab label="Новые" value="new"/>
        <Tab label="Популярные" value="popular"/>
      </Tabs>

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {( isPostLoading ? [...Array(5)] : sortedPosts).map((obj, index) => isPostLoading ? (
		  	<Post key={index} isLoading={true} />
		  	) : (
            <Post
			  key={index} 
			  _id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl}
              user={
				obj.user
			  }
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={isUserPosts}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
