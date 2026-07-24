import UIKit
import Capacitor

// Subclass ini cuma untuk memastikan WebView bisa di-debug lewat Safari Web Inspector
// (fitur "isInspectable" wajib di-set manual sejak iOS 16.4, Capacitor tidak selalu
// otomatis mengaktifkannya tergantung versi). Tidak mengubah perilaku app sama sekali,
// cuma nambah kemampuan debugging.
class MainViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        if #available(iOS 16.4, *) {
            self.webView?.isInspectable = true
        }
    }
}
