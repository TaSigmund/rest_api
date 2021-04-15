/***
 * USER MODEL
 ***/

'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A first name is required."
                },
                notEmpty: {
                    msg: "A first name is required."
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A last name is required."
                },
                notEmpty: {
                    msg: "A last name is required."
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "There is already an account associated with your e-mail address."
            },
            validate: {
                notNull: {
                    msg: "An e-mail address is required."
                },
                isEmail: {
                    msg: "Please enter a valid e-mail address."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required."
                },
                notEmpty: {
                    msg: "A password with 8-20 letters is required"
                }
            }
        } 
}, { sequelize });

User.associate = models => {
    User.hasMany(models.Course, {
        foreignKey:{
            fieldName: 'userId'
    }});
};

  return User;
};