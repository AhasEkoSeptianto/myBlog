type I_LabelRequired = {
    label?: any
    pClassName?: string
}

export default function LabelRequired(props: I_LabelRequired){

    const { label, pClassName } = props

    return <p className={pClassName}><span className="text-red-500">*</span>{label}</p>
}