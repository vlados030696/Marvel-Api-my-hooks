import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/Error'
import {useState, useEffect, useRef} from 'react'


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOfsset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const {loading, error, getAllCharacters} =  useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended = true;
        }
        setCharList(charList => [...charList, ...newCharList])
        setnewItemLoading(newItemLoading => false);
        setOfsset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }


    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true)
        getAllCharacters(offset)
        .then(onCharListLoaded)
    }


    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={(el => itemRefs.current[i] = el)}
                key={item.id}
                onClick={() => {
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
            </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
                {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
            style={{display: charEnded ? 'none' : 'block'}}
            disabled={newItemLoading}
            onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



export default CharList;