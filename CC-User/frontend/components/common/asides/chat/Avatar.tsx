type AvatarProps = {
    user?: {
      avatar: string;
    };
  };
  
  const Avatar = ({ user }: AvatarProps) => {
    const avatarUrl =
      user?.avatar || 'https://crazycargo.gg/template/img/avatar.jpg';
  
    return (
      <div className="relative m-1">
        <img className="icon-medium rounded-full" src={avatarUrl} alt="User Avatar" />
      </div>
    );
  };
  
  export default Avatar;
  