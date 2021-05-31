const express = require('express')
const app = express()
const port = 3100
const fs = require('fs/promises')
const Axios = require('axios')
const dayjs = require('dayjs')

// 允许跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	// res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.use(express.json()) // for parsing application/json

// 公共头
const COMMON_HEADERS = {
	"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
	"User-Agent": "MiFit/4.6.0 (iPhone; iOS 14.0.1; Scale/2.00)",
};

// axios配置
const axios = Axios.create({
	timeout: 30000,
	headers: {
		...COMMON_HEADERS
	}
});

// 路由
app.post('/run', function(req, response, next) {
	const config = {
		username: req.body.phoneNumber,
		password: req.body.password,
		step_size: req.body.steps,
		user_id: '',
		app_token: '',
	};
	console.log(config);
	run(config);
	async function run(config) {
		const code = await loginByPassword(config.username, config.password);
		const {
			app_token,
			user_id
		} = await getAccessToken(code);
		config.app_token = app_token;
		config.user_id = user_id;
		const step = config.step_size
		await pushBandData(step, config.user_id, config.app_token);
	}
	
	function toUrlEncode(obj) {
		const data = new URLSearchParams();
		const keys = Object.keys(obj);
		keys.forEach((key) => data.append(key, obj[key]));
		return data;
	}
	
	async function getAccessToken(code) {
		const data = toUrlEncode({
			app_name: "com.xiaomi.hm.health",
			app_version: "4.6.0",
			code: code,
			country_code: "CN",
			device_id: "2C8B4939-0CCD-4E94-8CBA-CB8EA6E613A1",
			device_model: "phone",
			grant_type: "access_token",
			third_name: "huami_phone",
		});
	
		try {
			const res = await axios.post("https://account.huami.com/v2/client/login", data);
			const token_info = res.data.token_info;
			return token_info;
		} catch (e) {
			console.log("获取AccessToken失败");
			response.status(200).send({err:"获取AccessToken失败",code:'402'})
			response.end()
			throw e;
		}
	}
	
	async function loginByPassword(username, password) {
		const redirect_uri = new URL(
			"https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html"
		);
		const data = toUrlEncode({
			client_id: "HuaMi",
			password: password,
			redirect_uri: redirect_uri.toString(),
			token: "access",
		});
	
		try {
			const res = await axios.post(
				`https://api-user.huami.com/registrations/+86${username}/tokens`,
				data
			);
			// 获取Code
			const path = new URL(res.request.path, redirect_uri);
	
			const params = path.searchParams;
			if (params.has("access")) {
				const code = params.get("access");
				console.log(`获取登录授权码成功 code: ${code}`);
				return code;
			}
			throw new Error("获取登录授权码失败");
		} catch (e) {
			console.log("登录失败， 请检查账号密码");
			response.status(200).send({err:"登录失败， 请检查账号密码",code:'401'});
			response.end()
			throw e;
		}
	}
	
	async function pushBandData(step, user_id, app_token) {
		const data = toUrlEncode({
			userid: user_id,
			last_sync_data_time: 1597306380,
			device_type: 0,
			last_deviceid: "DA932FFFFE8816E7",
			data_json: await buildDataJson(step),
		});
	
		try {
			const res = await axios.post(
				`https://api-mifit-cn.huami.com/v1/data/band_data.json?&t=${Date.now()}`,
				data, {
					headers: {
						apptoken: app_token,
					},
				}
			);
			response.status(200).send({success:"刷步数成功！",code:'200'})
			console.log(`上传步数成功 step：${step}`);
		} catch (e) {
			console.log("上传步数失败");
			response.status(200).send({err:"上传步数失败",code:'403'})
			response.end()
			throw e;
		}
	}
	
	async function buildDataJson(step) {
		const time = dayjs().format("YYYY-MM-DD");
		const find_date = /.*?date":"(.*?)","data.*?/;
		const find_step = /.*?ttl\\":(.*?),\\"dis.*?/;
	
		let data_json = await fs.readFile("./data.json", "utf-8");
		data_json = data_json.replace(find_date.exec(data_json)[1], time);
		data_json = data_json.replace(find_step.exec(data_json)[1], step);
		return data_json;
	}
})




app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
