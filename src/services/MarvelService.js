import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => {
    const {loading, request, clearError, error} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=af99376e03dc7f4e5d312e6d3949f929';
    //const _imgNotFound = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
        
        
    }
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])
        
    }
    const getComicById = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
        
    }
    const getComics = async () => {
        const res = await request(`${_apiBase}comics?limit=8&${_apiKey}`);
        return res.data.results.map(_transformComics);

    }
    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No info',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}` : 'No aviliable'

        }

    }
    const _transformCharacter = (char) => {
    
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path +  '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
    return {loading, error, clearError, getAllCharacters, getCharacter, getComics, getComicById}
    
}
export default useMarvelService;
