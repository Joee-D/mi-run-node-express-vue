<template>
	<div class="box" style="user-select: none;">
		<div class="jumbotron">
			<h1 class="display-4">你好！</h1>
			<p class="lead">欢迎来到 帮你出去走走</p>
			<hr class="my-4">
			<p style="color: red;">使用之前请先看教程：</p>
			<a class="btn btn-primary btn-lg" href="https://docs.qq.com/doc/DU1lSSGRBT1pKQlVB" role="button">教程</a>
		</div>
		<el-divider></el-divider>
		<div align="center">
			<el-tag type="danger" effect="dark">仅供学习交流，严禁用于商业用途!</el-tag>
			<div style="margin-top: 1%;">
				<el-input placeholder="请输入小米运动注册时的手机号" v-model="input1" maxlength='11'>
					<template slot="prepend">账号：</template>
				</el-input>
				<el-input placeholder="请输入小米运动注册时的密码" v-model="input2" show-password>
					<template slot="prepend">密码：</template>
				</el-input>
				<el-input placeholder="请输入小于99999步数" v-model="input3" maxlength='5'>
					<template slot="prepend">步数：</template>
				</el-input>
			</div>
			<el-button type="primary" @click='shua'>shua ~</el-button>
		</div>
		<el-divider></el-divider>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				input1: '',
				input2: '',
				input3: ''
			};
		},
		methods: {
			shua() {
				if (this.input1 == '' || this.input2 == '' || this.input3 == '') {
					this.$message({
						showClose: true,
						message: '请填写完整再提交！',
						type: 'error',
						center: true
					});
				} else {
					axios.post('/run', {
							phoneNumber: this.input1,
							password: this.input2,
							steps: this.input3
						})
						.then(({
							data
						}) => {
							if (data.code == 200) {
								this.$message({
									showClose: true,
									message: data.success,
									type: 'success',
									center: true
								});
							} else {
								this.$message({
									showClose: true,
									message: data.err,
									type: 'error',
									center: true
								});
								this.input1 = ''
								this.input2 = ''
							}
						})
				}
			},
		}
	}
</script>

<style scoped>
	.el-tag {
		width: 95%;
		text-align: center;
		height: 50px;
		line-height: 50px;
		font-size: 100%;
	}

	.el-input {
		width: 95%;
		margin: 5px;
	}

	.el-button {
		margin-top: 1%;
	}
</style>
