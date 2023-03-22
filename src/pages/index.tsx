import {Button, Space} from 'antd-mobile'
import style from '@/styles/home.module.scss'
import {useEffect} from "react";
import {useTranslation} from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Home() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log('process.env.NEXT_PUBLIC_API--->')
        console.log(process.env.NEXT_PUBLIC_API)
    }, [])

    return (
        <>

            <div>
                <div className={style.title}>标题-{t('h1')}</div>
                <div className={style.line}>line</div>
                <Space wrap>
                    <Button
                        onClick={() => i18n.changeLanguage(i18n.language == 'en' ? 'zh' : 'en')}
                    >
                        Default
                    </Button>
                    <Button color='primary'>Primary</Button>
                    <Button color='success'>Success</Button>
                    <Button color='danger'>Danger</Button>
                    <Button color='warning'>Warning</Button>
                </Space>

                <Space wrap align='center'>
                    <Button size='mini' color='primary'>
                        Mini
                    </Button>
                    <Button size='small' color='primary'>
                        Small
                    </Button>
                    <Button size='middle' color='primary'>
                        Middle
                    </Button>
                    <Button size='large' color='primary'>
                        Large
                    </Button>
                </Space>
            </div>
        </>
    )
}

export async function getStaticProps(ctx) {
    console.log('locale-->');
    console.log(ctx);
    return {
        props: {
            ...(await serverSideTranslations(ctx.locale, ['common'])),
        },
    }
}
