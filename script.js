let currentUserId=null;
let steps=0, water=0;

// SPA navigation
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.style.display='none');
  document.getElementById(id).style.display='block';
}

document.getElementById('userAge').addEventListener('input', function(){
    if(this.value < 0){
      this.value = 0;
    }
  })

// Login / Profile
document.getElementById('saveProfile').onclick = ()=>{
  const name=document.getElementById('userName').value.trim();
  const age=parseInt(document.getElementById('userAge').value);
  const feet=parseInt(document.getElementById('userFeet').value);
  const inch=parseInt(document.getElementById('userInch').value);
  const weight=parseFloat(document.getElementById('userWeight').value);

  

  if(!name||!age||feet<0||inch<0||!weight){ alert('Fill all fields'); return; }

  currentUserId = name.toLowerCase().replace(/\s+/g,'');
  const profile={name,age,height:`${feet}ft ${inch}in`,weight};
  saveUser(currentUserId, profile);

  steps=getUserSteps(currentUserId);
  water=getUserWater(currentUserId);

  document.getElementById('profile-id').style.display='block';

  loadProfile(); renderWorkouts(); renderMeals(); renderWater(); checkHealth(); renderCharts();
  showScreen('dashboard');
}

// Load profile
function loadProfile(){
  if(!currentUserId) return showScreen('login');
  const profile=getUser(currentUserId);
  if(!profile) return showScreen('login');
  document.getElementById('profileInfo').innerHTML=
    `<p>Name: ${profile.name}</p><p>Age: ${profile.age}</p><p>Height: ${profile.height}</p><p>Weight: ${profile.weight} kg</p>`;
}
function editProfile(){ showScreen('login'); }

// Workouts
function getWorkouts(){ 
  return getUserWorkouts(currentUserId); 
}
function saveWorkout(){
  const type=document.getElementById('workoutType').value;
  const duration=parseInt(document.getElementById('workoutDuration').value);
  const calories=parseInt(document.getElementById('workoutCalories').value);
  if(type !== '' || duration !== 0|| !calories == 0){
    document.getElementById('warning-messege').style.display='block';
    
  }
  else{
    const workout={type,duration,calories,date:new Date().toISOString()};
  saveUserWorkout(currentUserId, workout);
  renderWorkouts(); renderCharts(); checkHealth();
  }
  // if(!type||!duration||!calories){
  //    alert('Fill all fields'); return; 
  //   }
  
}
function renderWorkouts(){
  const listEl=document.getElementById('allWorkouts');
  const recentEl=document.getElementById('workoutList');
  const workouts=getWorkouts();
  listEl.innerHTML=workouts.map(w=>`<div style='color:black;' class="card">${w.type} | ${w.duration} min | ${w.calories} cal</div>`).join('');
  recentEl.innerHTML=workouts.slice(-3).map(w=>`<div class="card">${w.type} | ${w.duration} min | ${w.calories} cal</div>`).join('');
}

// Meals
function getMeals(){ return getUserMeals(currentUserId); }
function saveMeal(){
  const name=document.getElementById('mealName').value;
  const calories=parseInt(document.getElementById('mealCalories').value);
  if(!name||!calories){ 
    document.getElementById('warning-messege-meal').style.display='block'; 
    return; 
  }
  const meal={name,calories,date:new Date().toISOString()};
  saveUserMeal(currentUserId, meal);
  renderMeals(); renderCharts(); checkHealth();
}
function renderMeals(){
  const listEl=document.getElementById('allMeals');
  const recentEl=document.getElementById('mealList');
  const meals=getMeals();
  listEl.innerHTML=meals.map(m=>`<div style='color:black;' class="card">${m.name} | ${m.calories} cal</div>`).join('');
  recentEl.innerHTML=meals.slice(-3).map(m=>`<div class="card">${m.name} | ${m.calories} cal</div>`).join('');
}

// Steps
function addStep(){ steps++; saveUserSteps(currentUserId, steps); document.getElementById('steps').innerText=steps; checkHealth(); }

// Water
function drinkWater(){ water+=250; saveUserWater(currentUserId, water); document.getElementById('waterIntake').innerText=water; renderWater(); checkHealth(); }
function renderWater(){
  const history=document.getElementById('waterHistory');
  history.innerHTML=`<div style='color:black;' class="card">Total Water: ${water} ml</div>`;
}

// Health Check
function checkHealth(){
  const profile=getUser(currentUserId);
  const w=getWorkouts(); const m=getMeals();
  let status='Needs more data';
  let suggestions='-';
  if(profile){
    let activity=w.length>=1;
    let diet=m.length>=1;
    let waterOk=water>=1500;
    status=(activity && diet && waterOk)? 'Good 👍':'Needs Improvement ⚠️';

    suggestions='';
    if(!activity) suggestions+='Do more workouts. ';
    if(!diet) suggestions+='Add healthy meals. ';
    if(!waterOk) suggestions+='Drink more water. ';
  }
  document.getElementById('healthStatus').innerText=status;
  document.getElementById('healthSuggestions').innerText=suggestions;
}

// Charts
function renderCharts(){
  const workouts=getWorkouts(); const meals=getMeals();
  const wCtx=document.getElementById('workoutChart').getContext('2d');
  const mCtx=document.getElementById('mealChart').getContext('2d');
  wCtx.clearRect(0,0,350,200); mCtx.clearRect(0,0,350,200);

  // simple bar chart: last 7 workouts
  wCtx.fillStyle='#00796b';
  workouts.slice(-7).forEach((w,i)=>{
    wCtx.fillRect(i*45,200-(w.calories/2),30,w.calories/2);
    wCtx.fillText(w.type,i*45,190-(w.calories/2));
  });

  // simple bar chart: last 7 meals
  mCtx.fillStyle='#d32f2f';
  meals.slice(-7).forEach((m,i)=>{
    mCtx.fillRect(i*45,200-(m.calories/2),30,m.calories/2);
    mCtx.fillText(m.name,i*45,190-(m.calories/2));
  });
}

// Water reminder every 2 hours
setInterval(()=>{
  if(currentUserId) alert('💧 Time to drink water!');
}, 2*60*60*1000); // 2 hours

// Init
window.onload=()=>{
  const users=getUsers();
  const keys=Object.keys(users);
  if(keys.length>0){ currentUserId=keys[0]; }
  if(currentUserId){
    steps=getUserSteps(currentUserId);
    water=getUserWater(currentUserId);
  }
  document.getElementById('steps').innerText=steps;
  document.getElementById('waterIntake').innerText=water;
  renderWorkouts(); renderMeals(); renderWater(); checkHealth(); renderCharts();
  loadProfile();
}
