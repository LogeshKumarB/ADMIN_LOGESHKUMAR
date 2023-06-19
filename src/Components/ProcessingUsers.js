export const ProcessingUsers=(users)=>
{
    return users.map(user => {
        user.selected = false;
        user.edit = false;
        return user;})
}