import AJAX from '@/util/ajax'
import API from '@/util/api'
import { Toast } from 'mint-ui'

const userStore = {
	namespaced: true,
	state: {
		token: "",
		email: "",
		picurl: "https://web.billson.club/images/default.jpg",
		nickname: "用户昵称",
		sex: 2,
		waller: 0,
		birth: "",
		acount: "用户帐号",
		collect: []
	},
	getters: {

	},
	mutations: {
		getToken(state, token) {
			state.token = token
			if(token && token !== "") {
				AJAX.get(API.getAddress()).then(res => {
					if(res.code === 200) {
						this.commit("address/initAdrList", res.data)
						Toast({
							message: "获取收货地址成功!",
							duration: 1000
						})
					}
					AJAX.post(API.getCartList()).then(initCartRes => {
						if (initCartRes.code === 200) {
							this.commit("cart/initCart", initCartRes.data)
						}
						AJAX.post(API.getCollect()).then(initCollectRes => {
							if (initCollectRes.code === 200) {
								console.log(initCollectRes, "213423")
								this.commit("cart/initCollect", initCollectRes.result.col_list)
							}
						})
					})
				}).catch(err => {
					console.log("获取收藏列表失败", err)
				})
			}
		},
		initInfo(state, data) {
			state.email = data.us_email && data.us_email !== "" ? data.us_email : ""
			state.picurl = data.us_picurl && data.us_picurl !== "" ? data.us_picurl : "https://web.billson.club/images/default.jpg"
			state.nickname = data.us_nickname && data.us_nickname !== "" ? data.us_nickname : "用户昵称"
			state.sex = data.us_sex && data.us_sex !== "" ? data.us_sex : "2"
			state.waller = data.us_waller && data.us_waller !== "" ? data.us_waller : 0
			state.birth = data.us_birthday && data.us_birthday !== "" ? data.us_birthday : ""
			state.acount = data.us_acount && data.us_acount !== "" ? data.us_acount : "用户帐号"
		},
		updateInfo(state, data) {
			state.nickname = data.nickname
			state.email = data.email
		}
	},
	actions: {
		initToken({
			commit
		}) {
			if(localStorage.getItem("yoho_billson_token") && localStorage.getItem("yoho_billson_token") !== "") {
				AJAX.post(API.getInfo()).then(res => {
					if(res.code === 200) {
						commit("initInfo", res.result.data[0])
						commit("getToken", localStorage.getItem("yoho_billson_token"))
					} else {
						localStorage.removeItem("yoho_billson_token")
					}
					Toast({
						message: res.msg,
						duration: 1000
					})
				}).catch(err => console.log(err))
			}
		}
	}
}

export default userStore