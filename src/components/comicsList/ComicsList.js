import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/Error';
import Spinner from '../spinner/Spinner';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ComicsList = (props) => {
    const [comicsList, setComicsList] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const {loading, error, getComics} =  useMarvelService();

    useEffect(() => {
        onRequest(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.lenght < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewComicsLoading(false);
        setComicsEnded(ended);
    }
const onRequest = (initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getComics()
        .then(onComicsListLoaded);
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                     {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                        </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newComicsLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newComicsLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest()}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;