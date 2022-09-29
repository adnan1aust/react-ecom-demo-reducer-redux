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
    cartTotal:0
})

//1ST STEP FOR REDUCER
const INITIAL_STATE = {
    isCartOpen : false,
    cartItems: [],
    cartCount: 0,
    cartTotal:0
}

//2ND STEP FOR REDUCER
const CART_ACTION_TYPE = {
    SET_CART_ITEMS : 'SET_CART_ITEMS',
    TOGGLE_CART : 'TOGGLE_CART'

}

//3RD STEP FOR REDUCER
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
    const[cartTotal, setTotal] = useState(0);

    useEffect(()=>{
        const newCartCount = cartItems.reduce((cartTotal, cartItem)=> cartTotal + cartItem.quantity,0);
        const cartTotal = cartItems.reduce((cartTotal, cartItem) => cartTotal + cartItem.quantity * cartItem.price, 0)
        setCartCount(newCartCount);
        setTotal(cartTotal);
    }, [cartItems]) */

    //4RTH STEP FOR REDUCER
    const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch ] = useReducer(cartReducer, INITIAL_STATE);

    const updateCartItemReducer = (newCartItems) => {
        const newCartCount = newCartItems.reduce((cartTotal, cartItem)=> cartTotal + cartItem.quantity,0);
        const newCartTotal = newCartItems.reduce((cartTotal, cartItem) => cartTotal + cartItem.quantity * cartItem.price, 0);
        //5TH STEP FOR REDUCER
        dispatch({type: CART_ACTION_TYPE.SET_CART_ITEMS, payload: {cartItems: newCartItems, cartTotal: newCartTotal, cartCount: newCartCount}});
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

    const value = {isCartOpen, setIsCartOpen, addItemToCart, cartItems, cartCount, removeItemFromCart, clearItemFromCart, cartTotal};
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}