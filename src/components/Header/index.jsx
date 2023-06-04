import React from 'react';

import { useDispatch, useSelector } from "react-redux";
import Button from '@mui/material/Button';
import { Link, Navigate } from 'react-router-dom';
import{ logout, selectIsAuth } from '../../redux/slices/auth'

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
	if (window.confirm('Are you sure you want to log out?')) {
		dispatch(logout());
		window.localStorage.removeItem('token')
		return <Navigate to="/" />
	}
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>FULL MERN BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
			  	<Link to="/my-posts">
                  <Button variant="contained" color="info">Мои статьи</Button>
                </Link>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
