import ThemeButton from './ThemeButton';

const Header = ({ isDark, onToggle }) => {
  return (
    <header className="site-header">
      <div className={isDark ? 'dark-text logo' : 'light-text logo'}>Robert Toroitich</div>
      <ThemeButton isDark={isDark} onToggle={onToggle} />
    </header>
  );
};

export default Header;