const logout = () => {
  localStorage.removeItem('at_session')
  location.href = 'login.html'
}
