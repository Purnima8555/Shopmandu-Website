

const ProfileMenuButton = ({onClick, icon: Icon, title=""}) => {
  return (
                  <button
                    onClick={onClick}
                className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-all flex items-center gap-2.5 cursor-pointer"
              >
                {Icon && <Icon className="w-4 h-4 text-text-secondary" />}
                <span>{title}</span>
              </button>
  )
}

export default ProfileMenuButton