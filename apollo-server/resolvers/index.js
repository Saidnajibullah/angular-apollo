import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
const photos = [
    {
        size: 400,
        description: "Moutains with snow",
        url: "mountain.png",
        userEmail: 'Said@gmail.com'
    },
    {
        size: 600,
        description: "Desney world",
        url: "desney.png",
        userEmail: 'Said@gmail.com'
    },
    {
        size: 600,
        description: "Wild dog",
        url: "wild-dog.png",
        userEmail: 'jalal@gmail.com'
    },
    {
        size: 800,
        description: "fire work",
        url: "fire.png",
        userEmail: 'jamal@gmail.com'
    },
    {
        size: 200,
        description: "Avator",
        url: "avator.png",
        userEmail: 'jamal@gmail.com'
    }
]
const users = [
    {
        name: "Said",
        email: "Said@gmail.com",
        zip: 93021
    },
    {
        name: "Jalal",
        email: "jalal@gmail.com",
        zip: 93023
    },
    {
        name: "Jamal",
        email: "jamal@gmail.com",
        zip: 93025
    }
]

const resolvers = {
    Query: {
        getUsers: () => {
            users.forEach(user =>{
                user.postedPhotos = photos.filter(photo => user.email == photo.userEmail);
            })
            return users
        },
        getPhotos: () => {
            photos.forEach(photo =>{
                photo.postedBy = users.find(user => photo.userEmail == user.email);
            })
            return photos
        },
        getUserByZip: (parent, args, context, info) => {
            const user = users.filter(user => user.zip == args.zip)[0];
            return user;
        },
    },
    Mutation: {
        addUser: async (parent, args, context, info) => {
            users.push(args.user);
            pubsub.publish("NEW_USER", {newUser: args.user});
            return true;
        }
    },
    Subscription: {
        onUserAdded: {
            subscribe: async (_, __, context) => {
                return pubsub.asyncIterator(["NEW_USER"])
            },
            resolve: payload => payload.newUser
        }
    }
}
export default resolvers