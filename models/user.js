module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    email: {
      type: DataTypes.STRING(40),
      allowNull: true,
      unique: true,
    },
    nick: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local',
    },
    snsId: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })
);

// module.exports = (sequelize, DataTypes) => {
//   sequelize.define('user', {
//     email: {
//       type: DataTypes.STRING(40),
//       allowNull: true, 
//       unique: true,
//     },
//     nick: {
//       type: DataTypes.STRING(15),
//       allowNull: false,
//     },
//     password: {
//       type: DataTypes.STRING(100),
//       allowNull: true, // sns 로그인을 대비하여 true로 세팅
//     },
//     provider: {
//       type: DataTypes.STRING(10),
//       allowNull: false,
//       defaultValue: 'local', // 기본적으로 local 로그인으로 세팅
//     },
//     snsId: { // SNS 인증시 계정
//       type: DataTypes.STRING(30),
//       allowNull: true,
//     },
//   }, {
//     timestamps: true, // 자동으로 createdAt 과 updatedAt이 생성됨
//     paranoid: true, // 자동으로 deletedAt이 생성됨
//   });
// };