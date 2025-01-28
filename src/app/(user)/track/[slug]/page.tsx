'use client'
import WaveTrack from '@/components/track/wave.track';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
import { useSearchParams } from 'next/navigation'

const DetailTrackPage = async (props: any) => {
    const { params } = props;
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
        method: "GET",
    })
    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: params.slug,
            sort: "-createdAt"
        },
    })
    const searchParams = useSearchParams()
    const search = searchParams.get('audio')
    console.log(">>> check search: ", search)
    return (
        <Container>DetailTrackPage
            <div>
                <WaveTrack
                    track={res?.data ?? null}
                    comments={res1?.data?.result ?? []}
                />
            </div>
        </Container>
    )
}
export default DetailTrackPage;