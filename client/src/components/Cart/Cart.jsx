import { Button, Drawer, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, removeProduct, removeAllProducts } from '../../redux/rootReducer/cartSlice'
import { Stack, Box } from '@mui/material';
import { Divider, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toogleCart } from '../../redux/rootReducer/toogleSlice';
import { useState, useEffect } from 'react';
import axios from 'axios'


const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const abrir = useSelector(state => state.toogle.isOpen)
    const [order, setOrder] = useState({})

    useEffect(() => {
        setOrder({
            user: {
                id: 1234,
                name: "prueba",
                email: "prueba@gmail.com",
            },
            items: cart.cart.cart.map((product) => ({
                id: product.id,
                title: product.title,
                unit_price: product.price,
                quantity: product.quantity,
            })),
        });
    }, [cart.cart.cart]);

    console.log(order);

    //handlers

    const handleBuy = async () => {
        try {
            const response = await axios.post('http://localhost:3001/checkout', order);
            console.log("Response:", response);
            dispatch(removeAllProducts())
            // Hacer algo con la respuesta exitosa
        } catch (error) {
            console.error("Error:", error.response.data);
            // Manejar el error
        }
    }

    const handleClose = () => {
        dispatch(toogleCart())
    }
    const handleAdd = (id) => {
        dispatch(addProduct(id))
    };

    const handleRemove = (id) => {
        dispatch(removeProduct(id))
    };

    const handleRemoveAll = () => {
        dispatch(removeAllProducts())

    };

    return (
        <Drawer anchor={'right'} open={abrir} onClose={() => handleClose()}>
            <Box sx={{ width: '25em', p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Cart</Typography>
                    <Button variant='contained' color="primary" size="small" sx={{ ml: 1 }} onClick={() => handleClose()}>
                        <CloseIcon />
                    </Button>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                {cart.cart.cart.map((product) => {
                    return (
                        <Grid container spacing={2} key={product.id}>
                            <Grid item xs={4}>
                                <img src={product.image} alt={product.title} width="100%" />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="subtitle1">{product.title}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ({product.authors})
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    ${product.price}
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <Button
                                        onClick={() => handleRemove(product.id)}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1 }}
                                    >
                                        <RemoveIcon />
                                    </Button>
                                    <Button
                                        onClick={() => handleAdd(product)}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    >
                                        <AddIcon />
                                    </Button>
                                    <Typography>{product.quantity}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    );
                })}
                {cart.cart.cart.length === 0 && (
                    <Typography variant="subtitle1">There is no product in your cart</Typography>
                )}
                {cart.cart.cart.length !== 0 && <Typography variant="subtitle1">{'Total Price: $ ' + cart.cart.totalPrice}</Typography>}
                <Button
                    onClick={() => handleRemoveAll()}
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ marginTop: 2, marginRight: 2, }}
                >
                    Remove all products
                </Button>
                <Button
                    onClick={() => handleBuy()}
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ marginTop: 2 }}
                >
                    Buy Products
                </Button>

            </Box>
        </Drawer>
    )
}


export default Cart;


//link snackbar para notificación de agregado de libro // https://mui.com/material-ui/react-snackbar/