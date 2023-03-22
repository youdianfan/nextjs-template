//可以参考以下代码：
import axios from 'axios';

const instance = axios.create({
	// 配置axios实例
});

// 请求拦截器
instance.interceptors.request.use(config => {
	// 在请求头中携带token
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, error => {
	return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
	return response;
}, error => {
	// 判断是否token失效
	if (error.response && error.response.status === 401) {
		// 发送刷新token请求
		return instance.post('/refresh_token', {refreshToken: localStorage.getItem('refreshToken')})
			.then(res => {
				// 更新本地存储的token
				localStorage.setItem('token', res.data.token);
				localStorage.setItem('refreshToken', res.data.refreshToken);
				// 重新发送之前的请求
				const config = error.config;
				config.headers.Authorization = `Bearer ${res.data.token}`;
				return instance.request(config);
			})
			.catch(err => {
				// 刷新token失败，未认证或其他错误，清除本地存储的token信息
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				return Promise.reject(err);
			});
	} else {
		return Promise.reject(error);
	}
});

// 导出实例
export default instance;

//在请求拦截器中，我们可以在每个请求头中携带本地存储的token，保证请求带上token。在响应拦截器中，我们判断响应状态是否为401，如果是，则说明token失效，此时我们发送刷新token请求，在刷新成功后，更新本地存储的token，重新发送之前的请求。若刷新token失败，说明未认证或其他错误，清除本地存储的token信息，避免后续请求带上错误的token。最后，我们导出配置好自动刷新token的axios实例。
