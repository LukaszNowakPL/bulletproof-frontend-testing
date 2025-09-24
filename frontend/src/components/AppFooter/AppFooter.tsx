import React from 'react';
import {Separator, Text, Link} from '@radix-ui/themes';
import * as styles from './AppFooter.styles';
import {ExternalLinkIcon} from '@radix-ui/react-icons';

export const AppFooter: React.FC = () => {
    return (
        <>
            <Separator orientation="horizontal" size={'4'} className={styles.footerSeparator} />
            <footer className={styles.footerContainer}>
                <Text as={'p'}>
                    Written & produced by{' '}
                    <Link
                        href={'https://linkedin.com/in/%C5%82ukasz-nowak-533844101'}
                        target={'_blank'}
                        title={'Link to Linkedin profile, click opens it on new tab.'}
                        underline={'always'}
                    >
                        Łukasz Nowak
                    </Link>
                    .
                </Text>
                <Text as={'p'}>
                    For training purposes. Please share{' '}
                    <Link href={'https://github.com/LukaszNowakPL/bulletproof-frontend-testing'} target={'_blank'} underline={'always'}>
                        <ExternalLinkIcon aria-label={'Link to repository'} />
                    </Link>{' '}
                    if you found it sexy.
                </Text>
            </footer>
        </>
    );
};
