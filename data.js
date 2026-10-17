// data.js: Multi-user storage helper

// Users
function getUsers(){ return JSON.parse(localStorage.getItem('users')||'{}'); }
function saveUser(userId, profile){
  const users=getUsers(); users[userId]=profile;
  localStorage.setItem('users', JSON.stringify(users));
}
function getUser(userId){ const users=getUsers(); return users[userId]||null; }

// Workouts
function getUserWorkouts(userId){ 
  const data=JSON.parse(localStorage.getItem('workouts')||'{}'); 
  return data[userId]||[]; 
}
function saveUserWorkout(userId, workout){ 
  const data=JSON.parse(localStorage.getItem('workouts')||'{}'); 
  if(!data[userId]) data[userId]=[]; data[userId].push(workout); 
  localStorage.setItem('workouts', JSON.stringify(data)); }

// Meals
function getUserMeals(userId){ const data=JSON.parse(localStorage.getItem('meals')||'{}'); return data[userId]||[]; }
function saveUserMeal(userId, meal){ const data=JSON.parse(localStorage.getItem('meals')||'{}'); if(!data[userId]) data[userId]=[]; data[userId].push(meal); localStorage.setItem('meals', JSON.stringify(data)); }

// Water
function getUserWater(userId){ const data=JSON.parse(localStorage.getItem('water')||'{}'); return data[userId]||0; }
function saveUserWater(userId, water){ const data=JSON.parse(localStorage.getItem('water')||'{}'); data[userId]=water; localStorage.setItem('water', JSON.stringify(data)); }

// Steps
function getUserSteps(userId){ const data=JSON.parse(localStorage.getItem('steps')||'{}'); return data[userId]||0; }
function saveUserSteps(userId, steps){ const data=JSON.parse(localStorage.getItem('steps')||'{}'); data[userId]=steps; localStorage.setItem('steps', JSON.stringify(data)); }
