/**title: 修改手机号 */
import React, { Component } from 'react';
import styles from './index.less'
import { Toast, WhiteSpace, WingBlank, Button, Flex, Icon, Modal, Checkbox } from 'antd-mobile';
import Request from '@/services/request';
import qs from 'qs';
import router from 'umi/router';
import Cookies from 'js-cookie';

let timer = null;
const AgreeItem = Checkbox.AgreeItem;

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}


export default class bindPhoneNumber extends Component {

    state = {
        // 手机号
        phone: "",
        // 验证码
        code: "",
        is_ok: true,
        wait: "",
        bank_no: '',
        showModal: false,

        isAgree: false,
        showAgree: false,

        agreementDesc: "",

        // 流水号
        seqNo: "",

        isOkClick: true
    }

    // 销毁定时器
    componentWillUnmount() {
        clearInterval(timer)
    }

    handleChangePhone = (e: any) => {
        this.setState({
            phone: e.target.value
        })
    }

    handleChangeCode = (e: any) => {
        this.setState({
            code: e.target.value
        })
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    handleAfterClose = () => {
        this.setState({
            isAgree: false
        })
    }

    handleIsAgree = (e) => {
        this.setState({
            isAgree: e.target.checked
        })
    }


    handleSendCodeModal = () => {
        this.setState({
            showModal: true
        })
    }

    handleSendCode = () => {
        // console.log(this.state.isAgree)
        const { isAgree } = this.state;
        if (isAgree) {
            const { phone } = this.state;
            if (!(/^1[3456789]\d{9}$/.test(phone))) {
                Toast.fail('请输入11位有效手机号', 1);
                return;
            }
            let wait = 60;
            if (phone) {
                let _this = this;
                function resend() {
                    if (wait == 0) {
                        _this.setState({ is_ok: true });
                        clearInterval(timer)
                    } else {
                        wait--;
                        _this.setState({ is_ok: false, wait });
                        clearInterval();
                    }
                }
                resend();
                timer = setInterval(() => {
                    resend()
                }, 1000);
                Toast.loading('',6000)
                Request({
                    url: 'v3/sq/send_sms_code',
                    method: 'post',
                    data: qs.stringify({
                        phone
                    })
                }).then(res => {
                  Toast.hide()
                    if (res.status_code == 200) {
                        Toast.success('验证码已发送');
                        _this.setState({
                            isAgree: false,
                            showModal: false,
                            seqNo: res.data.seqNo
                        })
                    } else {
                        _this.setState({
                            is_ok: true,
                            isAgree: false,
                            showModal: false
                        });
                        clearInterval(timer);
                        Toast.fail(res.message);
                    }
                }).catch(()=>{
                  Toast.hide()
                })
            } else {
                Toast.fail('请输入手机号', 1)
            }
        }
    }

    handleNext = async () => {
        const { phone, code, seqNo } = this.state;
        // console.log(phone, code);
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
            Toast.fail('请输入11位有效手机号', 1);
            return;
        }
        if (!code) {
            Toast.fail('请输入验证码', 1);
            return;
        }
        await this.setState({ isOkClick: false })
        Request({
            url: 'v3/sq/bind_card',
            method: "POST",
            data: qs.stringify({
                // bankcard_no: this.state.bank_no,
                // verify_code: code,
                // mobile: phone
                seqNo: seqNo,
                code: code,
                phone
            })
        }).then(res => {
            if (res.status_code == 200) {
                this.setState({ isOkClick: true })
                Toast.success('绑卡成功', 1, () => {
                    router.push({ pathname: '/doubledry/withdraw' });
                });
            } else {
                this.setState({ isOkClick: true })
                Toast.fail(res.message);
            }
        })


    }

    handleCountDetail = () => {
        this.setState({
            showAgree: true,
            agreementDesc: " 亲爱的用户，当前团卖物联科技（广州）有限公司与双乾支付签订合作协议，开展线上电子交易结算账户，便于客户线上交易资金划转，方便客户更快捷的处理平台资金提现到账需求，通过第三方支付平台（双乾支付），保障客户资金安全，以及构建公平、安全、规范交易行为环境。双乾支付是知名国际卡收单服务的第三方支付平台，目前与团卖物联科技（广州）有限公司签订服务合同合作关系！双乾支付依照相关法规要求进行实名制管理、履行反洗钱职责和采取风险防范措施。为了您可以正常使用双乾支付服务，您的身份信息、联系方式、交易信息需要被依收集并使用。涉及开立单位支付账户的，根据相关监管要求，为确保贵单位的合法权益，我们需要核实贵单位法定代表人或负责人开通双乾支付账户的真实意愿。请贵单位法人代表或负责人对一下开户情况进行确认：1、本单位在双乾支付开立支付账户为我单位真实意愿；2、本单位向双乾支付提交的所有证明材料（包括但不限于开户证明材料）真实有效，且我单位与证明材料所属人一致。"
        })
    }

    handlePayDetail = () => {
        this.setState({
            showAgree: true,
            agreementDesc: "双乾服务（以下简称本服务）是由双乾网络支付有限公司（以下简称本公司）向广大用户提供的非金融机构支付服务，是受您委托代您收款或付款的资金转移服务。其中，代收代付款项服务是指本公司为您提供的代为收取或代为支付款项的服务。本协议由您和本公司签订。一、双乾服务协议的确认（一）本协议有助于您了解双乾为您提供的服务内容及您使用服务的权利和义务，请您仔细阅读（特别是以粗体标注的内容）。（二）请您确认，在您注册成为双乾用户接受本服务之前，您已充分阅读、理解并接受本协议的全部内容，一旦您使用本服务，即表示您同意遵循本协议之所有约定。（三）如本协议发生变更，双乾将通过网站公告的方式提前予以公布，变更后的协议在公告期届满起生效。若您在协议生效后继续使用双乾服务的，表示您接受变更后的协议，也将遵循变更后的协议使用双乾服务。（四）如您为无民事行为能力人或为限制民事行为能力人，请告知您的监护人，并在您监护人的指导下阅读本协议和使用双乾服务。若您是中国大陆以外的用户，您还需同时遵守您所属国家或地区的法律，且您确认签订与履行本协议不受您所属、所居住或开展经营活动或其他业务的国家或地区法律法规的限制。 （五）本协议不涉及用户因网上交易而与相关交易方产生的法律关系及法律纠纷。用户因进行商品或服务交易或接触双乾网站服务器而发生的所有应纳税赋，以及一切硬件、软件、服务及其它方面的费用均由用户负责支付。（六）双乾仅受用户委托提供代收代付款项等双乾服务，不介入用户与任何第三方的商品或服务交易，用户与任何第三方的交易风险和纠纷，由用户自行通过合法途径解决。（七）请您注意并充分理解，双乾账户所记录的资金余额不同于您本人的银行存款，不受《存款保险条例》保护，其实质为您委托双乾保管的、所有权归属于您的预付价值。该预付价值对应的货币资金虽然属于您，但不以您本人名义存放在银行，而是以本公司名义存放在银行，并且由本公司向银行发起资金调拨指令。（八）您本人（单位）充分了解并清楚知晓出租、出借、出售、购买账户的相关法律责任和惩戒措施，承诺依法依规开立和使用本人（单位）账户二、双乾服务相关定义                       （一）双乾账户：指您在注册时，本公司向您提供的唯一编号。您可自行为该双乾账户设置密码，并用以查询或计量您的预付、应收或应付款。您需使用本人邮箱或手机号码或者本公司允许的其它手段作为双乾账户名登录该双乾账户。（二）双乾中介服务：即本公司向您提供代为收取或代为支付的中介服务，其中包含：1、代管：您可以使用本服务指定的方式向您的双乾账户充值，并委托本公司代为保管2、代收：您可以要求本公司代为收取其他双乾用户向您支付的各类款项。3、代付：您可以要求本公司将代管或代收的您的款项支付给您指定的第三方。您同意，本公司代付后，非经法律程序或者非依本协议之约定，该支付是不可逆转的。4、提现：您可以要求向本公司提取您的款项。当您向本公司做出提现指令时，必须提供一个与您委托本公司代管时的汇款人或您的名称相符的有效的中国大陆银行账户，本公司将于收到指令后的一至五个工作日内，将相应的款项汇入您提供的有效银行账户（根据您提供的银行不同，会产生汇入时间上的差异）。除本条约定外，本公司不接受您提供的其他受领方式。5、查询：本公司将对您在本系统中的所有操作进行记录，不论该操作之目的最终是否实现。您可以在本系统中实时查询您的双乾账户名下的交易记录，您认为记录有误的，本公司将向您提供本公司已按照您的指令所执行的收付款的记录。您理解并同意您最终收到款项的服务是由您提供的银行账户对应的银行提供的，您需向该银行请求查证。6、款项专属：对您支付到本公司并归属至您双乾账户的款项及您通过双乾账户收到的货款，本公司将予以妥善保管，除本协议另行规定外，不作任何其他非您指令的用途。7、转账服务：是指买卖双方使用本系统，且约定买卖合同项下的货款通过买方双乾账户即时向卖方双乾账户支付的一种支付方式。本公司提示您注意：该项服务一般适用于您与交易对方彼此都有充分信任的小额交易。在您与交易对方同意选择即时到账服务支付货款时，您所支付的款项将立刻进入交易对方的双乾账户，本公司对此不提供任何双乾中介服务。基于此项服务可能存在的风险，在使用即时到账服务支付交易货款之前时，您理解并接受： 1）为控制可能存在的风险，本公司对所有用户使用即时到账服务支付交易货款时的单日交易总额以及单笔交易最高额进行了限制，并保留对限制种类和限制限额进行无需预告地调整的权利。2）用户可能收到由于使用转账服务的付款方指示错误（失误）而转账到用户双乾账户或银行账户的款项，在此情况下用户应该根据国家的相关法律的规定和实际情况处理收到的该笔款项。3）使用转账服务或即时到账服务支付货款是基于您对交易对方的充分信任，一旦您选用该方式，相对应的交易将不受本协议所有交易保护条款的保障，您将自行承担所有交易风险并自行处理所有相关的交易及货款纠纷。三、双乾账户（一） 注册相关在使用本服务前，您必须先行注册，取得本公司提供给您的双乾账户（以下亦简称该账户），您同意：1、您同意，用户交易限额可能因您使用该支付服务时所持的银行卡种类、所处的国家/地区、支付场景、风险控制需要和监管部门的要求等事由而有所不同，具体额度请见相关提示或公告。2、按照双乾要求准确提供并在取得该账户后及时更新您正确、最新及完整的身份信息及相关资料。若本公司有合理理由怀疑您提供的身份信息及相关资料错误、不实、过时或不完整的，本公司有权暂停或终止向您提供部分或全部双乾服务。本公司对此不承担任何责任，您将承担因此产生的任何直接或间接支出。若因国家法律法规、部门规章或监管机构的要求，本公司需要您补充提供任何相关资料时，如您不能及时配合提供，本公司有权暂停或终止向您提供部分或全部双乾服务。3、因您未及时更新资料（包括但不限于身份证、户口本、护照等证件或其他身份证明文件、联系方式、与双乾账户绑定的邮箱、手机号码等），导致本服务无法提供或提供时发生任何错误，您不得将此作为取消交易、拒绝付款的理由，您将承担因此产生的一切后果，本公司不承担任何责任。 4、您应对您的双乾账户负责，只有您本人可以使用您的双乾账户，该账户不可转让、不可赠与、不可继承。在您决定不再使用该账户时，您应将该账户下所对应的可用款项全部提现或者向本公司发出其它支付指令，并向本公司申请注销该账户。您同意，若您丧失全部或部分民事权利能力或民事行为能力，本公司有权根据有效法律文书（包括但不限于生效的法院判决、生效的遗嘱等）处置与您的双乾账户相关的款项。 （二） 账户安全您将对使用该账户及密码进行的一切操作及言论负完全的责任，您同意：1、本公司通过您的账户名和密码识别您的指示，您应当妥善保管您的账户名和密码及身份信息，对于因密码泄露、身份信息泄露所致的损失，由您自行承担。您保证不向其他任何人泄露该账户名及密码以及身份信息，亦不使用其他任何人的双乾账户及密码。本公司亦可能通过本服务应用您使用的其他产品或设备识别您的指示，您应当妥善保管处于您或应当处于您掌控下的这些产品或设备，对于这些产品或设备遗失所致的任何损失，由您自行承担。2、如您发现有他人冒用或盗用您的账户及密码或任何其他未经合法授权之情形时，应立即以有效方式通知本公司，要求本公司暂停相关服务。同时，您理解本公司对您的请求采取行动需要合理期限，在此之前，本公司对已执行的指令及(或)所导致的您的损失不承担任何责任。 3、交易异常处理：您使用本服务时同意并认可，可能由于银行本身系统问题、银行相关作业网络连线问题或其他不可抗拒因素，造成本服务无法提供。您确保您所输入的您的资料无误，如果因资料错误造成本公司于上述异常状况发生时，无法及时通知您相关交易后续处理方式的，本公司不承担任何损害赔偿责任。4、您同意，基于运行和交易安全的需要，本公司可以暂时停止提供或者限制本服务部分功能,或提供新的功能，在任何功能减少、增加或者变化时，只要您仍然使用本服务，表示您仍然同意本协议或者变更后的协议。5、本公司有权了解您使用本公司产品或服务的真实交易背景及目的，您应如实提供本公司所需的真实、全面、准确的信息；如果本公司有合理理由怀疑您提供虚假交易信息的，本公司有权暂时或永久限制您所使用的产品或服务的部分或全部功能。6、您同意，为了您的双乾账户及其内资金的安全，根据本协议的约定、法律法规及法律文书的规定、政府依行政职权的要求及本公司依据自行判断认为的可能对您的双乾账户产生风险的情况，本公司有权对您的双乾账户进行冻结，即进行暂时关闭该账户部分或全部使用权限的操作。冻结的逆过程为解冻，即本公司对您的被冻结的双乾账户结束冻结。当冻结发生时，如您申请解冻，本公司有权依照自行判断根据本项规定前述的冻结原因来决定是否允许解冻，您应充分理解您的解冻申请并不必然被允许，且申请解冻时您应当配合本公司核实您的身份的有关要求，提供包括但不限于身份信息、身份证、护照、其他有效的身份证明文件及本公司要求的其他信息或文件。7、您同意，本公司有权按照包括但不限于公安机关、检察机关、法院、海关、税务机关等司法机关、行政机关、军事机关的要求对您在双乾的资金及账户等进行查询、冻结或扣划。(三)支付相关您同意：在首次使用认证或快捷支付时，授权本公司发起开通验证操作，后续支付操作仅需输入发卡行预留手机号即可完成支付。您须确保输入预留手机号为本人操作，如非本人操作，请立即联系发卡行或本公司，否则您将承担由此引发的一切后果，本公司不承担任何责任。(四) 注销相关在需要终止使用本服务时,您可以申请注销您的双乾账户,您同意:1、您所申请注销的双乾账户应当是您依照本协议的约定注册并由本公司提供给您本人的账户。您应当依照本公司规定的程序进行双乾账户注销。2、双乾账户注销将导致本公司终止为您提供本服务，本协议约定的双方的权利义务终止（依本协议其他条款另行约定不得终止的或依其性质不能终止的除外），同时还可能对于该账户产生如下结果：A、任何兑换代码（购物券、礼品券、集分宝或优惠券等）都将作废；B、任何银行卡将不能适用该账户内的支付或提现服务。3、您可以通过自助或者人工的方式申请注销双乾账户，但如果您使用了本公司提供的安全产品，应当在该安全产品环境下申请注销。4、您申请注销的双乾账户应当处于正常状态，即您的双乾账户的账户信息和用户信息是最新、完整、正确的，且该账户可以使用所有双乾服务功能的状态。账户信息或用户信息过时、缺失、不正确的账户或被冻结的账户不能被申请注销。如您申请注销的账户有关联账户或子账户的，在该关联账户或子账户被注销前，该账户不得被注销。特别地，如果您的账户在连续3年内没有任何账户操作行为或资金变动，且满足本协议规定的其他注销条件时，本公司有权依照本协议的规定或国家相关法律法规的要求主动进行注销，由此引发的一切后果由您本人承担。5、您申请注销的双乾账户应当不存在任何由于该账户被注销而导致的未了结的合同关系与其他基于该账户的存在而产生或维持的权利义务，及本公司认为注销该账户会由此产生未了结的权利义务而产生纠纷的情况。6、如果您申请注销的双乾账户一旦注销成功，将不再予以恢复。四、双乾服务使用规则为有效保障您使用本服务时的合法权益，您理解并同意接受以下规则：（一）一旦您使用本服务，您即授权本公司代理您在您及（或）您指定人符合指定条件或状态时，支付款项给您指定人，或收取您指定人支付给您的款项。（二）本公司通过以下三种方式接受来自您的指令：其一，您在本网站或其他可使用本服务的网站或软件上通过以您的双乾账户名及密码或数字证书等安全产品登录双乾账户并依照本服务预设流程所修改或确认的交易状态或指令；其二，您通过您注册时作为该账户名称或者与该账户绑定的手机或其他专属于您的通讯工具（以下合称该手机）号码向本系统发送的信息（短信或电话等）回复；其三，您通过您注册时作为该账户名称或者与该账户名称绑定的其他硬件、终端、软件、代号、编码、代码、其他账户名等有形体或无形体向本系统发送的信息（如本方式所指有形体或无形体具备与该手机接受信息相同或类似的功能，以下第四条第（三）、（四）、（五）项和第六条第（三）项涉及该手机的条款同样适用于本方式）。无论您通过以上三种方式中的任一种向本公司发出指令，都不可撤回或撤销，且成为本公司代理您支付或收取款项或进行其他账户操作的唯一指令，视为您本人的指令，您应当自己对本公司忠实执行上述指令产生的任何结果承担责任。本协议所称绑定，指您的双乾账户与本条上述所称有形体或无形体存在对应的关联关系，这种关联关系使得双乾服务的某些服务功能得以实现，且这种关联关系有时使得这些有形体或无形体能够作为本系统对您的双乾账户的识别和认定依据。除本协议另有规定外，您与第三方发生交易纠纷时，您授权本公司自行判断并决定将争议款项的全部或部分支付给交易一方或双方。（三）您在使用本服务过程中，本协议内容、网页上出现的关于交易操作的提示或本公司发送到该手机的信息（短信或电话等）内容是您使用本服务的相关规则，您使用本服务即表示您同意接受本服务的相关规则。您了解并同意本公司有权单方修改服务的相关规则，而无须征得您的同意，服务规则应以您使用服务时的页面提示（或发送到该手机的短信或电话等）为准，您同意并遵照服务规则是您使用本服务的前提。（四）本公司会以电子邮件（或发送到该手机的短信或电话等）方式通知您交易进展情况以及提示您进行下一步的操作，但本公司不保证您能够收到或者及时收到该邮件（或发送到该手机的短信或电话等），且不对此承担任何后果，因此，在交易过程中您应当及时登录到本网站查看和进行交易操作。因您没有及时查看和对交易状态进行修改或确认或未能提交相关申请而导致的任何纠纷或损失，本公司不负任何责任。 （五） 您如果需要向交易对方交付货物，应根据交易状态页面（该手机接收到的信息）显示的买方地址，委托有合法经营资格的承运人将货物直接运送至对方或其指定收货人，并要求对方或其委托的第三方（该第三方应当提供对方的授权文件并出示相应的身份证件）在收货凭证上签字确认，因货物延迟送达或在送达过程中的丢失、损坏，本公司不承担任何责任，应由您与交易对方自行处理。（六） 本公司对您所交易的标的物不提供任何形式的鉴定、证明的服务。除本协议另有规定外，如您与交易对方发生交易纠纷，您授权由本公司根据本协议及本网站上载明的各项规则进行处理。您为解决纠纷而支出的通讯费、文件复印费、鉴定费等均由您自行承担。因市场因素致使商品涨价跌价而使任何一方得益或者受到损失而产生的纠纷（《争议处理规则》另有约定的除外），本公司不予处理。（七） 若您未通过实名认证，他人通过本服务向您支付款项时，相应款项将无法使用或提现，您授权本公司暂时代为保管该款项，直到您完成实名认证。 （八） 本公司会将与您双乾账户相关的资金，独立于本公司营运资金之外，且不会将该资金用于非您指示的用途，但《双乾交易通用规则》约束的交易及本条第（十四）项约定的除外。（九） 本公司并非银行或其它金融机构，本服务也非金融业务，本协议项下的资金移转均通过银行来实现，你理解并同意您的资金于流转途中的合理时间。（十）信用卡及网上银行使用之确认：用户在使用信用卡及银行账户交易前，需首先确定该信用卡已经发卡银行确认为有效卡，且该银行账户亦经确认为有效账户。信用卡使用需遵守相关法律法规及中国人民银行及各商业银行相关规定，不得使用信用卡恶意套取现金。 用户理解并认可，本公司可根据风险管理要求、应合作银行的要求等对信用卡的消费类型和消费额度进行限制。（十一）充值：当用户注册成为本服务的用户并成功激活双乾账户后，用户可通过银行在线充值，以便用户交易时可以快捷安全地支付。用户理解并认可，本公司根据相关法律、法规、规章、监管部门及风险管理的要求可对充值双乾账户的资金来源和充值额度进行限制。（十二） 您确认并同意，您应自行承担您使用本服务期间由本公司保管或代收或代付款项的货币贬值风险，并且本公司无须就此等款项向您支付任何孳息或其他对价。（十三）在您注册成为双乾用户时，您授权本公司通过银行或向第三者审核您的身份和资格，并取得关于您使用本服务的相关资料。（十四）您使用本服务进行交易或使用该账户登录其他支持本服务的网站时，您即授权本公司将您的个人信息和交易信息披露给与您交易的另一方或您登录的网站，该信息包括但不限于：您的真实姓名、联系方式、信用状况、双乾账户。（十五）您不得将本服务用于非本公司许可的其他用途。（十六）交易风险1）在使用本服务时，若您或您的交易对方未遵从本服务条款或网站说明、交易页面中之操作提示、规则），则本公司有权拒绝为您与交易对方提供相关服务，且本公司不承担损害赔偿责任。若发生上述状况，而款项已先行划付至您或他人的双乾账户名下，您同意本公司有权直接自相关账户余额中扣回款项及（或）禁止您要求支付此笔款项之权利。此款项若已汇入您的银行账户，您同意本公司有向您事后索回之权利，因您的原因导致本公司事后追索的，您应当承担本公司合理的追索费用（包括但不限于律师费、公证费、诉讼费等费用）。2）因您的过错导致的任何损失由您自行承担，该过错包括但不限于：不按照交易提示操作，未及时进行交易操作，遗忘或泄漏密码，密码被他人破解，您使用的计算机被他人侵入。（十七）服务费用1）在您使用本服务时，本公司有权依照《双乾服务收费规则》向您收取服务费用。本公司拥有制订及调整服务费之权利，具体服务费用以您使用本服务时本网站上所列之收费方式公告或您与本公司达成的其他书面协议为准。2）除非另有说明或约定，您同意本公司有权自您委托本公司代管、代收或代付的款项中直接扣除上述服务费用。 （十八）积分1）就您使用本服务，本公司将通过多种方式向您授予积分，积分不具有现金价值，无论您通过何种方式获得积分，您都不得使用积分换取任何现金或金钱。2)积分不具备任何财产性质，并非您拥有所有权的财产，本公司有权单方面调整积分数值或调整本公司的积分规则，而无须征得您的同意。3)您仅有权按本公司的积分规则，将所获积分交换本公司提供的指定的服务或产品。4)如本公司怀疑您的积分的获得及(或)使用存有欺诈、滥用或其它本公司认为不当的行为，本公司可随时取消、限制或终止您的积分或积分使用。（十九）本服务所涉及到的任何款项只以人民币计结，不提供任何形式的结售汇业务。五、双乾服务使用限制（一） 您在使用本服务时应遵守中华人民共和国相关法律法规、您所在国家或地区之法令及相关国际惯例，不将本服务用于任何非法目的（包括用于禁止或限制交易物品的交易），也不以任何非法方式使用本服务。（二） 您不得利用本服务从事侵害他人合法权益之行为，否则本公司有权拒绝提供本服务，且您应承担所有相关法律责任，因此导致本公司或本公司雇员受损的，您应承担赔偿责任。上述行为包括但不限于：1、侵害他人名誉权、隐私权、商业秘密、商标权、著作权、专利权等合法权益。2、违反依法定或约定之保密义务。3、冒用他人名义使用本服务。4、从事不法交易行为，如洗钱、恐怖融资、贩卖枪支、毒品、禁药、盗版软件、黄色淫秽物品、其他本公司认为不得使用本服务进行交易的物品等。5、提供赌博资讯或以任何方式引诱他人参与赌博。6、非法使用他人银行账户（包括信用卡账户）或无效银行账号（包括信用卡账户）交易。7、违反《银行卡业务管理办法》使用银行卡，或利用信用卡套取现金（以下简称套现）。8、进行与您或交易对方宣称的交易内容不符的交易，或不真实的交易。9、从事任何可能含有电脑病毒或是可能侵害本服务系统、资料之行为。10、其他本公司有正当理由认为不适当之行为。（三） 您理解并同意，本公司不对因下述任一情况导致的任何损害赔偿承担责任，包括但不限于利润、商誉、使用、数据等方面的损失或其他无形损失的损害赔偿 (无论本公司是否已被告知该等损害赔偿的可能性)：1、本公司有权基于单方判断，包含但不限于本公司认为您已经违反本协议的明文规定及精神，暂停、中断或终止向您提供本服务或其任何部分，并移除您的资料。2、本公司在发现异常交易或有疑义或有违反法律规定或本协议约定之虞时，有权不经通知先行暂停或终止该账户的使用（包括但不限于对该账户名下的款项和在途交易采取取消交易、调账等限制措施），并拒绝您使用本服务之部分或全部功能。3、您理解并同意：在您使用本协议项下或您与双乾另行签署协议中的相关产品或服务，本公司有权基于单方面判断认为您的使用行为存在异常时，包括但不限于您收入或支付的款项金额以及/或操作频次不同于往常或者相关业务模式存在风险，或您使双乾的行为涉嫌违反国家相关法律法规、部门规章等，可以冻结您收入或支付的部分或全部款项，或冻结您的双乾账户，或暂停执行您部分或全部指令。如果本公司冻结款项或暂停执行您的指令，本公司将会采取电话或邮件或者短信等方式通知您，但本公司不保证您能够收到或者及时收到该邮件（或发送到该手机的短信或电话等），且不对此承担任何后果。在本公司认为该等异常已经得到合理解释或有效证据支持或未违反国家相关法律法规及部门规章的情况下，最晚将于冻结款项或暂停执行指令之日起的30个日历天内解除冻结或恢复执行指令。但本公司有进一步理由相信该等异常仍可能对您或其他用户或本公司造成损失的情形除外，包括但不限于1）收到针对该等异常的投诉；2）您已经实质性违反了本协议或另行签署的服务协议，且我们基于保护各方利益的需要必须继续冻结款项或暂停执行指令；3）您虽未违反国家相关法律法规及部门规章规定，但该等使用涉及双乾限制合作的行业类目或商品，包括但不限于通过本公司的产品或服务从事类似金字塔或矩阵型的高额返利业务模式。4、在必要时，本公司无需事先通知即可终止提供本服务，并暂停、关闭或删除该账户及您账号中所有相关资料及档案，并将您滞留在该账户的全部合法资金退回到您的银行账户。 （四） 如您需要注销您的双乾账户，应先经本公司审核同意。本公司注销该账户，即表明本公司与您之间的协议已终止，但您仍应对您使用本服务期间的行为承担可能的违约或损害赔偿责任，同时本公司仍可保有您的相关信息。六、隐私权保护一旦您同意本协议或使用本服务，您即同意本公司按照以下条款来使用和披露您的个人信息。（一） 账户名和密码在您注册为双乾用户时，我们会要求您设置账户名和密码来识别您的身份，并设置安全保护问题及其答案，以便在您丢失密码时用以确认您的身份。您仅可通过您设置的密码来使用该账户，如果您泄漏了密码，您可能会丢失您的个人识别信息，并可能导致对您不利的法律后果。该账户和密码因任何原因受到潜在或现实危险时，您应该立即和本公司取得联系，在本公司采取行动前，本公司对此不负任何责任。（二） 注册信息您注册该账户时应向本公司提供您的真实姓名、地址、国籍、电话号码和电子邮件地址等国家法律法规要求的信息，您还可以选择来填写相关附加信息（包括但不限于您公司所在的省份和城市、时区和邮政编码、传真号码、个人主页和您的职务）。为有针对性地向您提供新的服务和机会，您了解并同意本公司或您登录的其他网站将通过您的电子邮件地址或该手机向您发送相关通知。（三） 银行账户信息本公司所提供的服务将需要您提供您的银行账户信息，在您提供相应信息后，本公司将严格履行相关保密约定。（四） 交易行为为了保障您使用本服务的安全以及不断改进服务质量，本公司将记录并保存您登录和使用本服务的相关信息，但本公司承诺不将此类信息提供给任何第三方（除双方另有约定或法律法规另有规定及本公司关联公司外）。（五） 广告本公司会对双乾用户的身份数据进行综合统计，并出于销售和奖励的需要使用或披露。（六）Cookie的使用及设备软硬件配置信息的收集。您了解并同意，本公司使用cookie来使本网站对用户更友好（它可以帮您省去为使用我们的服务而重复输入注册信息和跟踪您的浏览器的状态），同时，本公司站点会收集由您设备的软硬件配置信息生成的特征信息，用于标识您的设备，以便更好地为您服务。（七）为更为有效地向您提供服务，您同意，本公司有权将您注册及使用本服务过程中所提供、形成的信息提供给本公司关联公司。同时，为更安全有效地向您提供服务，根据法律法规的规定，或本公司需识别您的身份，或本公司认为您的账户存在风险时，本公司有权要求您提交身份信息（包括但不限于身份证、户口本、护照等证件或其他文件）。除本协议另有规定外，本公司不对外公开或向第三方提供您的信息，但以下情况除外：A、事先获得您的明确授权；B、只有披露您的个人资料，才能提供您需要的产品和（或）服务；C、按照本协议的要求进行的披露；D、根据法律法规的规定；E、按照政府主管部门的要求；F、为维护本公司及其关联公司的合法权益；G、您使用双乾账户成功登录过的其他网站； H、对您或您所代表公司的身份真实性进行验证。（八） 信息的存储和交换 您的信息和资料存储在位于中国的服务器上。（九） 外部链接本网站含有到其他网站的链接，但本公司对其他网站的隐私保护措施不负任何责任。本公司可能在任何需要的时候增加商业伙伴或共用品牌的网站。（十）安全本公司仅按现有技术提供相应的安全措施来使本公司掌握的信息不丢失，不被滥用和变造。这些安全措施包括向其它服务器备份数据和对用户密码加密。尽管有这些安全措施，但本公司不保证这些信息的绝对安全。七、 系统中断或故障系统因下列状况无法正常运作，使您无法使用各项服务时，本公司不承担损害赔偿责任，该状况包括但不限于：（一） 本公司在本网站公告之系统停机维护期间。（二） 电信设备出现故障不能进行数据传输的。 （三） 因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成本公司系统障碍不能执行业务的。（四） 由于黑客攻击、电信部门技术调整或故障、网站升级、银行方面的问题等原因而造成的服务中断或者延迟。 八、 责任范围及责任限制（一） 本公司仅对本协议中列明的责任承担范围负责。（二） 您明确因交易所产生的任何风险应由您与交易对方承担。（三） 双乾用户信息是由用户本人自行提供的，本公司无法保证该信息之准确、及时和完整，您应对您的判断承担全部责任。（四） 本公司不对交易标的及本服务提供任何形式的保证，包括但不限于以下事项：1、本服务符合您的需求。2、本服务不受干扰、及时提供或免于出错。3、您经由本服务购买或取得之任何产品、服务、资讯或其他资料符合您的期望。（五） 本服务之合作单位，所提供之服务品质及内容由该合作单位自行负责。（六） 您经由本服务之使用下载或取得任何资料，应由您自行考量且自负风险，因资料之下载而导致您电脑系统之任何损坏或资料流失，您应负完全责任。（七） 您自本公司及本公司工作人员或经由本服务取得之建议和资讯，无论其为书面或口头形式，均不构成本公司对本服务之保证。（八） 在法律允许的情况下，本公司对于与本协议有关或由本协议引起的任何间接的、惩罚性的、特殊的、派生的损失（包括业务损失、收益损失、利润损失、使用数据或其他经济利益的损失），不论是如何产生的，也不论是由对本协议的违约（包括违反保证）还是由侵权造成的，均不负有任何责任，即使事先已被告知此等损失的可能性。另外即使本协议规定的排他性救济没有达到其基本目的，也应排除本公司对上述损失的责任。（九） 除本协议另有规定外，在任何情况下，本公司对本协议所承担的违约赔偿责任总额不超过向您收取的当次服务费用总额。 九、商标、知识产权的保护（一） 本网站上所有内容，包括但不限于著作、图片、档案、资讯、资料、网站架构、网站画面的安排、网页设计，均由本公司或本公司关联企业依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。（二） 非经本公司或本公司关联企业书面同意，任何人不得擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表本网站程序或内容。（三） 尊重知识产权是您应尽的义务，如有违反，您应承担损害赔偿责任。十、法律适用与管辖本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律，没有相关法律规定的，参照通用国际商业惯例和（或）行业惯例。因本协议产生之争议，均应依照中华人民共和国法律予以处理，并以本公司所在地法院为管辖法院。"
        })
    }

    handlePayConceal = () => {
        this.setState({
            showAgree: true,
            agreementDesc: "双乾支付隐私协议一旦您同意本协议或使用本服务，您即同意本公司按照以下条款来使用和披露您的个人信息。（一） 账户名和密码在您注册为双乾用户时，我们会要求您设置账户名和密码来识别您的身份，并设置安全保护问题及其答案，以便在您丢失密码时用以确认您的身份。您仅可通过您设置的密码来使用该账户，如果您泄漏了密码，您可能会丢失您的个人识别信息，并可能导致对您不利的法律后果。该账户和密码因任何原因受到潜在或现实危险时，您应该立即和本公司取得联系，在本公司采取行动前，本公司对此不负任何责任。（二） 注册信息您注册该账户时应向本公司提供您的真实姓名、地址、国籍、电话号码和电子邮件地址等国家法律法规要求的信息，您还可以选择来填写相关附加信息（包括但不限于您公司所在的省份和城市、时区和邮政编码、传真号码、个人主页和您的职务）。为有针对性地向您提供新的服务和机会，您了解并同意本公司或您登录的其他网站将通过您的电子邮件地址或该手机向您发送相关通知。（三） 银行账户信息本公司所提供的服务将需要您提供您的银行账户信息，在您提供相应信息后，本公司将严格履行相关保密约定。（四） 交易行为为了保障您使用本服务的安全以及不断改进服务质量，本公司将记录并保存您登录和使用本服务的相关信息，但本公司承诺不将此类信息提供给任何第三方（除双方另有约定或法律法规另有规定及本公司关联公司外）。（五） 广告本公司会对双乾用户的身份数据进行综合统计，并出于销售和奖励的需要使用或披露。（六）Cookie的使用及设备软硬件配置信息的收集。您了解并同意，本公司使用cookie来使本网站对用户更友好（它可以帮您省去为使用我们的服务而重复输入注册信息和跟踪您的浏览器的状态），同时，本公司站点会收集由您设备的软硬件配置信息生成的特征信息，用于标识您的设备，以便更好地为您服务。（七）为更为有效地向您提供服务，您同意，本公司有权将您注册及使用本服务过程中所提供、形成的信息提供给本公司关联公司。同时，为更安全有效地向您提供服务，根据法律法规的规定，或本公司需识别您的身份，或本公司认为您的账户存在风险时，本公司有权要求您提交身份信息（包括但不限于身份证、户口本、护照等证件或其他文件）。除本协议另有规定外，本公司不对外公开或向第三方提供您的信息，但以下情况除外：A、事先获得您的明确授权；B、只有披露您的个人资料，才能提供您需要的产品和（或）服务；C、按照本协议的要求进行的披露；D、根据法律法规的规定；E、按照政府主管部门的要求；F、为维护本公司及其关联公司的合法权益；G、您使用双乾账户成功登录过的其他网站； H、对您或您所代表公司的身份真实性进行验证。"
        })
    }

    componentWillMount() {
        clearInterval(timer);
        // if (this.props.location.query.bankCode) {
        //     let occurTime = String(this.props.location.query.bankCode);
        //     let code = this.insertStr(this.insertStr(this.insertStr(this.insertStr(this.insertStr(occurTime, 4, " "), 9, " "), 14, " "), 19, " "), 24, " ");
        //     this.setState({ bank_no: code })
        // }
        this.getBankNo();
    }
    insertStr = (s: string, start: number, newStr: string) => {
        return s.slice(0, start) + newStr + s.slice(start);
    }

    getBankNo = () => {
        Request({
            url: 'v3/cardidentity_card'
        }).then(res => {
            if (res.code == 200) {
                let occurTime = String(res.data.bank_card_number);
                let code = this.insertStr(this.insertStr(this.insertStr(this.insertStr(this.insertStr(occurTime, 4, " "), 9, " "), 14, " "), 19, " "), 24, " ");
                this.setState({ bank_no: code })
            }
        })
    }

    render() {
        const { phone, code, is_ok, wait, isAgree } = this.state;
        return (
            <div className={styles.bind_phone}>
                <div className={styles.register_step}>
                    <div className={styles.unactive_step}>1</div>
                    <div className={styles.unactive_text}>注册开户</div>
                    <Icon type="right" color="#999999" />
                    <div className={styles.active_step}>2</div>
                    <div className={styles.active_text}>绑定激活</div>
                    <Icon type="right" color="#999999" />
                    <div className={styles.unactive_step}>3</div>
                    <div className={styles.unactive_text}>提现确认</div>
                </div>

                <div className={styles.bank_card}>
                    <div className={styles.card_info}>
                        <span>银行卡号：</span>
                        <span>{this.state.bank_no}</span>
                    </div>
                    <div className={styles.edit_card} onClick={() => router.push('/doubledry/editbank')}>修改银行卡</div>
                </div>

                <div className={styles.phoneNumber}>
                    <div className={styles.passwordBox}>
                        {/* {
                            this.props.location.query.bankCode ? <div className={styles.bankCardBox} >银行卡号：{this.state.bank_no}</div> : null
                        } */}

                        <div className={styles.content}>
                            <div className={styles.items1}>
                                <div className={styles.keyWords}>手机号码 </div>
                                <input className={styles.input1} type="text" placeholder="请输入银行预留手机号" onChange={this.handleChangePhone} value={phone} />
                            </div>
                            <div className={styles.items2}>
                                <div className={styles.keyWords}>验证码 </div>
                                <input className={styles.input2} type="text" placeholder="请输入验证码" onChange={this.handleChangeCode} value={code} />
                                {
                                    is_ok ? (
                                        <div className={styles.sendButton} onClick={this.handleSendCodeModal}>发送验证码</div>
                                    ) : (
                                            <div className={styles.sendButton}> {wait}s后重新获取</div>
                                        )
                                }
                            </div>
                        </div>
                        {
                            this.state.isOkClick ? (
                                <div className={styles.footButton} onClick={this.handleNext}>提交</div>
                            ) : <div className={styles.footButton}>提交</div>
                        }
                    </div>
                    <div id="success"></div>
                </div>




                <Modal
                    visible={this.state.showModal}
                    transparent
                    closable
                    maskClosable={false}
                    // title="绑卡提示"
                    onClose={this.onClose('showModal')}
                    // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('showModal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    afterClose={this.handleAfterClose}
                >
                    <div className={styles.modal}>
                        <div className={styles.title}>绑卡提示</div>
                        <div className={styles.icon}>
                            <img src={require('@/assets/dingding.png')} alt="" />
                        </div>
                        <div className={styles.text_tips}>当前绑定操作银行卡会收到双乾电子账户验证短信，通过验证后，即可完成绑卡</div>
                        <AgreeItem data-seed="logId" onChange={this.handleIsAgree}>
                            勾选并同意开通双乾电子账户
                        </AgreeItem>
                        <div className={styles.agree}>
                            <div className={styles.agree_info}>以下协议内容请您务必审慎阅读，并充分理解协议条款内容</div>
                            <div className={styles.agree_rules}>
                                <a onClick={this.handleCountDetail}>《双乾电子账户说明》</a>
                                <a onClick={this.handlePayDetail}>《双乾支付客户端及支付服务协议》</a>
                                <a onClick={this.handlePayConceal}>《双乾支付隐私协议》</a>
                            </div>
                        </div>
                        <div className={styles.submit_btn} style={isAgree ? { background: '#4486F7' } : { background: '#ADB5BD' }} onClick={this.handleSendCode}>提交</div>
                    </div>
                </Modal>

                <Modal
                    popup
                    onClose={this.onClose('showAgree')}
                    visible={this.state.showAgree}
                    animationType="slide-up"
                >
                    <div className={styles.agreement}>
                        <div className={styles.title}>协议说明</div>
                        <div className={styles.desc}>{this.state.agreementDesc}</div>
                    </div>
                </Modal>
            </div>
        )
    }
}
