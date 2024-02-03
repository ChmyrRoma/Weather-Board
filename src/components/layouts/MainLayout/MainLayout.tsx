import React from 'react';

import styles from './MainLayout.module.scss';

interface IProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: IProps) => {
  return (
    <div className={styles.mainLayout}>
      {children}
    </div>
  )
}

export default MainLayout;
