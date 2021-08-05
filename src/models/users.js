const db = require("../../data/db");

const addUser = async (newUser) => {
  console.log(newUser);
  return (
    db("User")
      // Pass in the whole object into the insert statement.
      .insert(newUser)
  );
};

const addUserProfile = async (newUserProfile) => {
  console.log(newUserProfile);
  return db("profile_information").insert(newUserProfile);
};
const findUsersBy = (filter) => db("User").where(filter);
const getRiotId = (filter) => db("Profile").select('riot_id').where(filter);

const getAllDuoListing = (filter) => {
  return db("DuoListing")
    .join("User", "User.id", "DuoListing.user_id")
    .select(
      "User.id",
      "User.username",
      "User.avatar",
      "User.discord_id",
      "User.discriminator",
      "DuoListing.rank",
      "DuoListing.champions",
      "DuoListing.roles",
      "DuoListing.post_description"
    );
};

const addDuoPost = (newPost) => {
  return db("DuoListing").insert(newPost);

};
const findProfileInformation = (filter) => {
  return db("Profile").where(filter);
};

const findSearchedUsers = (filter) => {
  if (!filter.length) {
    console.log("attempt to clear query");
    // return a empty row to clear the search page.
    return db
      .select("*")
      .from("profile_information")
      .where(1 != 2);
  } else if (filter.length) {
    console.log("we tried to grab users");
    // return users with at least one interest.
    return db.raw(
      `select * from profile_information where interests @> ?::text[]`,
      [filter]
    );
  }
};


module.exports = {
  addUser,
  addUserProfile,
  findUsersBy,
  getRiotId,
  findProfileInformation,
  findSearchedUsers,
  getAllDuoListing,
  addDuoPost
};
