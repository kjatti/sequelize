var Sequelize = require("./index");

var sequelize = new Sequelize("sequelize-test", "sa", "ezetc", {
    host: 'localhost',
    dialect: "mssql",
    dialectOptions: {
        encrypt: true
    }
})

var User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
},
    {
        freezeTableName: true // Model tableName will be the same as the model name
    });


var Post = sequelize.define('post', {
    content: {
        type: Sequelize.STRING,
    },
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});

User.hasMany(Post);
Post.belongsTo(User);

sequelize.sync({ force: true }).then(function () {

    User.bulkCreate(
        [
            { firstName: "Karthik", lastName: "Jatti" },
            { firstName: "shuai", lastName: "zhang" },
            { firstName: "bob", lastName: "marley" },
            { firstName: "nick", lastName: "tzaprev" }
        ]

    )
        .then(() => {
            sequelize.query("SELECT * FROM dbo.[user] where first_name = $1 OR last_name = $2", {
                bind: [
                    "Karthik",
                    "Tzaprev"
                ]
            }).then(x => console.log(x));

             sequelize.query("SELECT * FROM dbo.[user] where first_name = $firstName OR last_name = $lastName", {
                bind: {
                    firstName: "bob",
                    lastName: "zhang"
                }
            }).then(x => console.log(x));
        });

});
