import React, { useEffect } from 'react';
import { Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import{ selectIsAuth } from '../../redux/slices/auth'
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const navigate = useNavigate();
  const { id, userId } =useParams();
  const [text, setText] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isAuth = useSelector(selectIsAuth);

  const handleChangeFile = async (event) => {
	try {
		const formData = new FormData();
		const file = event.target.files[0]
		formData.append('image', file);
		const { data } = await axios.post('/upload', formData);
		setImageUrl(data.url);
		
	} catch (error) {
		console.warn(error);
		alert('Ошибка при загрузке файла');
	}
  };

  const onClickRemoveImage = () => {
	setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  useEffect(() => {
	if(id) {
		axios.get('/post/' + id)
		.then(({data: {title, text, tags, imageUrl}}) => {
			setTitle(title);
			setText(text);
			setImageUrl(imageUrl);
			setTags(tags);
		})
	}
  }, []);

  const onSubmit = async () => {
	try {
		setLoading(true);
		const fields = {
			title,
			tags,
			imageUrl,
			text,
			token: window.localStorage.getItem('token')
		}
		const { data } =  id ? await axios.patch(`/post/${id}`, fields) : await axios.post('/post', fields);
		const _id = data._id;
		
		navigate(`/posts/${id ? id : _id }`);

	} catch (error) {
		console.log(error);
		alert('Ошибка при созданий статьи')
	}
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
	return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" onChange={handleChangeFile} hidden ref={inputFileRef}/>
      {imageUrl && (
       <>
	    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <img className={styles.image} src={`http://localhost:3030${imageUrl}`} alt="Uploaded" />
	   </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
		value={title}
		onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }} value={tags} onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trimStart()))} variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
