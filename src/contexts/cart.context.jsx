import { createContext, /*useState, useEffect,*/ useReducer } from "react";


/*-----------------------------------------------Helper function starts--------------------------------------------------------*/
const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToAdd.id);
    if(existingCartItem){
        return cartItems.map((cartItem) => cartItem.id === productToAdd.id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem);
    }

    return [...cartItems, {...productToAdd, quantity: 1}];
}

const removeCartItem = (cartItems, productToRemove) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToRemove.id);
    if(existingCartItem.quantity === 1){
        return cartItems.filter((cartItem)=> cartItem.id !== productToRemove.id)
    }

    if(existingCartItem){
        return cartItems.map((cartItem) => cartItem.id === productToRemove.id ? {...cartItem, quantity: cartItem.quantity - 1} : cartItem);
    }
}


const clearCartItem = (cartItems, productToRemove) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToRemove.id);
    if(existingCartItem.quantity === 1){
        return cartItems.filter((cartItem)=> cartItem.id !== productToRemove.id)
    }
}

/*-----------------------------------------------Helper function ends--------------------------------------------------------*/


export const CartContext = createContext({
    isCartOpen : false,
    setIsCartOpen:() => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    total:0
})

const INITIAL_STATE = {
    isCartOpen : false,
    cartItems: [],
    cartCount: 0,
    total:0
}

const CART_ACTION_TYPE = {
    SET_CART_ITEMS : 'SET_CART_ITEMS',
    TOGGLE_CART : 'TOGGLE_CART'

}

const cartReducer = (state, action) => {
    const { type, payload } = action;
    switch(type){    
        case 'SET_CART_ITEMS':
            return{
                ...state,
                ...payload
            }
        case 'TOGGLE_CART':
            return{
                ...state,
                isCartOpen : !state.isCartOpen
        }
        default:
            throw new Error(`unhandaled type of ${type} in cart reducer`);
    }
}

export const CartProvider = ({children}) => {
/*  const[isCartOpen, setIsCartOpen] = useState(false);
    const[cartItems, setCartItems] = useState([]);
    const[cartCount, setCartCount] = useState(0);
    const[total, setTotal] = useState(0);

    useEffect(()=>{
        const newCartCount = cartItems.reduce((total, cartItem)=> total + cartItem.quantity,0);
        const total = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0)
        setCartCount(newCartCount);
        setTotal(total);
    }, [cartItems]) */

    const [{cartItems, isCartOpen, cartCount, total}, dispatch ] = useReducer(cartReducer, INITIAL_STATE);

    const updateCartItemReducer = (newCartItems) => {
        const newCartCount = newCartItems.reduce((total, cartItem)=> total + cartItem.quantity,0);
        const total = newCartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
        dispatch({type: CART_ACTION_TYPE.SET_CART_ITEMS, payload: {cartItems: newCartItems, total: total, cartCount: newCartCount}});
    }

    const addItemToCart = (productToAdd) => {
        //setCartItems(addCartItem(cartItems, productToAdd));
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartItemReducer(newCartItems);
    }

    const removeItemFromCart = (productToRemove) => {
        //setCartItems(removeCartItem(cartItems, productToRemove));
        const newCartItems = removeCartItem(cartItems, productToRemove);
        updateCartItemReducer(newCartItems);
    }

    const clearItemFromCart = (productToRemove) => {
        //setCartItems(clearCartItem(cartItems, productToRemove));
        const newCartItems = clearCartItem(cartItems, productToRemove);
        updateCartItemReducer(newCartItems);
    }

    const setIsCartOpen = () => {
        dispatch({type: CART_ACTION_TYPE.TOGGLE_CART});
    }

    const value = {isCartOpen, setIsCartOpen, addItemToCart, cartItems, cartCount, removeItemFromCart, clearItemFromCart, total};
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}