import React from 'react';
import { Text, View, Image,ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../styles/cartIndex';
import InputSpinner from "react-native-input-spinner";
import { Icon } from "react-native-elements";
import config from '../../api/config';
import callApi from '../../api/axios';
import {useState,useEffect} from 'react';
import 'intl';
import 'intl/locale-data/jsonp/vi';
const CartDetail = (props) => {
    const navi = props.navigation
    const [cart, setcart] = useState([]);
    const [delitem, setdelitem] = useState(0);
    useEffect(() => {
        navi.addListener("focus", () =>{
            callApi.get("/cartdetail_tmp.php").then((e)=>{
                setcart(e.data)
            })
        })
    }, []);
    const delitemcart =(id_cart, id_prd) =>{
        callApi.get("/delcartitem_tmp.php?id_cart="+id_cart+"&id_prd="+id_prd)
        .then((e) =>{
            // console.log(e.data);
            setdelitem( delitem + 1);
        })
    }
    useEffect(() => {
            callApi.get("/cartdetail_tmp.php").then((e)=>{
                setcart(e.data)
            })
    }, [delitem]);
    const total = ()=>{
        let rs =0;
        cart?.forEach(e => {
            rs+=e?.prd_qty*e?.price_prd*((100-e?.discount_prd)/100)
        });
        return rs;
    }
    const handleQuantity=(id,quantity) =>{
        let index =0;
         cart?.forEach((e,i) => {
            // console.log(e.id_prd,id);
            if(e.id_prd==id) index= i;
        });
        // console.log(index);
        let arr=[...cart]
        let item = {...cart[index]}
        item.prd_qty= quantity
        arr[index]= item

        setcart(arr)
    }
  
    return (
        <View style={styles.container}>
            <ScrollView style={styles.divPrd}>
                {cart?.map((cartItem,i)=>{
                    return(
                        <View style={styles.divPrdItem} key={i}>
                        <View style={styles.imgPrc}>
                        <Image 
                        style={styles.img}
                        source={{
                            uri: cartItem.image_prd,
                        }}
                            />
                        </View>
                        <View style={styles.Citem}>
                            <Text style={styles.nameP}>
                                {cartItem.name_prd}
                            </Text>
                            <View style={styles.ip}>
                                <InputSpinner 
                            style={{ 
                                shadowColor:true,
                                
                            } }
                            skin="clean"
                            inputStyle={{
                                fontSize :18,
                            }}                  
                                max={cartItem.amount_prd}
                                min={1}
                                step={1}
                                value={cartItem.prd_qty}
                                onChange={(num) => handleQuantity(cartItem.id_prd,num)}
                            />
                            </View>
                        </View>
                        <View style={styles.Ritem}>
                            <View style={styles.icon}>
                                 <Icon
                                color="#333"
                                name="trash-outline"
                                size={24}
                                type='ionicon'
                                onPress={() => delitemcart(cartItem.id_cart, cartItem.id_prd)}
                                />
                            </View>
                            <Text style={styles.price}>
                                
                            {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartItem.prd_qty*cartItem.price_prd*(100-cartItem.discount_prd)/100)}
                            </Text>
                        </View>
                    </View>
                    )
                })}
              </ScrollView>           
            <View style={styles.divPay}>
                <View style={styles.cost}>
                   <Text style={styles.tx}>Tổng tiền</Text>
                   <Text style={styles.Txc}>
                       
                   {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total())}
                   </Text>
                </View>
                <View style={styles.pay}>
                <TouchableOpacity
                    style={styles.btnP}
                    onPress={() => props.navigation.navigate('Payment',{cart: cart})} 
                    >
                        <Text
                             style={styles.TxP}
                        >
                            Đặt hàng ngay
                        </Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
        
        );
    }
    export default CartDetail;
